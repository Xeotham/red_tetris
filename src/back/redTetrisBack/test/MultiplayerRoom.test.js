const assert = require('assert');
const chai = require('chai');
const { MultiplayerRoom } = require('./../tetris_app/server/MultiplayerRoom.js');
const { io, Socket } = require("socket.io-client");
const { address } = require("../server/server");
const { TetrisGame } = require("../tetris_app/server/Game/TetrisGame");
const { codeNameExists, isUpperCase } = require("../tetris_app/utils");
const { multiplayerRoomLst } = require("../tetris_app/socket/controllers");

const expect = chai.expect;
const should = chai.should();

describe('MultiplayerRoom', () => {

	let clientSocket;

	before((done) => {
		clientSocket = io(`http://${process.env.ADDR + ":" + process.env.BACK_PORT}`, { transports: ['websocket'] });
		clientSocket.on('connect', done);
	});

	after(() => {
		// console.log("Disconnecting client socket...");
		if (clientSocket.connected) clientSocket.disconnect();
	});

	it('Should return if the room is in game', () => {
		const room = new MultiplayerRoom(clientSocket, true, undefined);
		expect(room.getIsInGame()).to.be.false;
		room.startGames();
		expect(room.getIsInGame()).to.be.true;
		room.players[clientSocket.id].getGame().setOver(true);
		// clientSocket.once('GAME_FINISH', () => { expect(room.getIsInGame()).to.be.false; });
	});

	it('Should return the list of players', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getPlayers()).to.be.an('object');
		expect(room.getPlayers()).to.have.property(clientSocket.id);
		expect(room.getPlayers()[clientSocket.id].getUsername()).to.equal(clientSocket.id);
		room.removePlayer(clientSocket);
		expect(room.getPlayers()[clientSocket.id]).to.equal(undefined);
		expect(Object.values(room.getPlayers())).to.be.empty;
	});

	it('Should return if the room is private', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.isPrivate()).to.be.true;
		room.addSetting("isPrivate", false);
		expect(room.isPrivate()).to.be.false;
	});

	it('Should return if the room is versus', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getIsVersus()).to.be.false;
		room.addSetting("isVersus", true);
		expect(room.getIsVersus()).to.be.true;
	});

	it('Should change and return the room code', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getCode()).to.equal("TEST");
		room.changeCode();
		expect(room.getCode()).to.not.equal("TEST"); // If the newly random generated code is the same, this test will fail.
		expect(room.getCode()).to.be.a('string');
		expect(isUpperCase(room.getCode())).to.be.true;
		expect(codeNameExists(room.getCode())).to.be.false; // codeNameExists checks for rooms stored in multiplayerRoomLst
		multiplayerRoomLst.push(room);
		expect(codeNameExists(room.getCode())).to.be.true;
		multiplayerRoomLst.splice(multiplayerRoomLst.indexOf(room), 1);
		const room2 = new MultiplayerRoom(clientSocket, true, "INVALID CODE");
		expect(room2.getCode()).to.not.equal("INVALID CODE");
	});

	it('Should set all the settings at once', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.settings).to.be.an('object');
		expect(room.settings).to.have.property('isPrivate').that.is.a('boolean');
		expect(room.settings).to.have.property('isVersus').that.is.a('boolean');
		expect(room.settings).to.have.property('level').that.is.an('number');
		room.setSettings({ isPrivate: false, isVersus: true });
		expect(room.isPrivate()).to.be.false;
		expect(room.getIsVersus()).to.be.true;
		expect(room.settings).to.not.have.property('level');
	});

	it('Should add a single setting', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.settings.level).to.equal(4);
		room.addSetting("level", 5);
		expect(room.settings.level).to.equal(5);
		expect(room.settings.test).to.be.undefined;
		room.addSetting("test", { value: "test" });
		expect(room.settings.test).to.deep.equal({ value: "test" });
	});

	it('Should add multiple settings', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.settings.level).to.equal(4);
		room.addSettings({ level: 6, test: { value: "test" } });
		expect(room.settings.level).to.equal(6);
		expect(room.settings.test).to.deep.equal({ value: "test" });
	});

	it('Should add a player to the room', () => {
		// clientSocket.once('MULTIPLAYER_JOIN', (data) => {
		// 	console.log("In MULTIPLAYER_JOIN");
		// 	expect(JSON.parse(data).argument).to.equal("TEST");
		// });
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getPlayers()).to.have.property(clientSocket.id);
		room.addPlayer(clientSocket);
		room.addPlayer(clientSocket);
		room.addPlayer(clientSocket);
		expect(Object.values(room.getPlayers()).length).to.equal(1);
		expect(room.settings.canRetry).to.be.true;
		room.addPlayer({ id: "testSocket", emit: () => {} });
		expect(room.getPlayers()).to.have.property("testSocket");
		expect(Object.values(room.getPlayers()).length).to.equal(2);
		expect(room.settings.canRetry).to.be.false;
		expect(room.getPlayers()["testSocket"]?.isOwner()).to.be.false;
	});

	it('Should remove a player from the room', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		room.addPlayer(clientSocket);
		room.addPlayer({ id: "testSocket", emit: () => {} });
		expect(room.settings.canRetry).to.be.false;
		expect(room.getPlayers()["testSocket"]?.isOwner()).to.be.false;
		room.removePlayer(clientSocket);
		expect(Object.values(room.getPlayers()).length).to.equal(1);
		expect(room.settings.canRetry).to.be.true;
		expect(room.getPlayers()["testSocket"]?.isOwner()).to.be.true;
		room.removePlayer(clientSocket);
		room.removePlayer(clientSocket);
		room.removePlayer(clientSocket);
		expect(Object.values(room.getPlayers()).length).to.equal(1);
		room.removePlayer({ id: "testSocket", emit: () => {} });
		expect(Object.values(room.getPlayers()).length).to.equal(0);
		expect(room.getPlayers()).to.not.have.property(clientSocket.id);
		expect(room.getPlayers()).to.not.have.property("testSocket");
	});

	it('Should return if the room is empty', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.isEmpty()).to.be.false;
		room.addPlayer(clientSocket);
		room.addPlayer(clientSocket);
		room.removePlayer(clientSocket);
		expect(room.isEmpty()).to.be.true;
		room.addPlayer(clientSocket);
		expect(room.isEmpty()).to.be.false;
		room.addPlayer({ id: "testSocket", emit: () => {} });
		expect(room.isEmpty()).to.be.false;
		room.removePlayer(clientSocket);
		expect(room.isEmpty()).to.be.false;
		room.removePlayer({ id: "testSocket", emit: () => {} });
		expect(room.isEmpty()).to.be.true;
	});

	it('Should return the game with the given id', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getGameById(clientSocket.id)).to.be.undefined;
		room.getPlayers()[clientSocket.id].setupGame({"level": 10, "test": "test"});
		room.addPlayer({ id: "testSocket", emit: () => {} });
		room.getPlayers()["testSocket"].setupGame({});
		expect(room.getGameById(clientSocket.id)).to.be.an.instanceOf(TetrisGame);
		expect(room.getGameById(clientSocket.id)).to.be.equal(room.getPlayers()[clientSocket.id].getGame());
		const game = room.getGameById(clientSocket.id);
		expect(game.getGameId()).to.equal(clientSocket.id);
		expect(game.level).to.equal(10);
		expect(game.test).to.be.undefined; // Will not set unknown settings.
	});

	it('Should start all the games, assign opponents, send opponents games and end them', async () => {
		const afterGames = () => {
			// console.log("After games");
			expect(room.getPlayers()[clientSocket.id].getGame()).to.be.undefined;
			expect(room.getPlayers()["testSocket"].getGame()).to.be.undefined;
			expect(room.getIsInGame()).to.be.false;
		}

		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		room.addPlayer(clientSocket);
		room.addPlayer({ id: "testSocket", emit: () => {} });
		expect(room.getPlayers()[clientSocket.id].getGame()).to.be.undefined;
		expect(room.getPlayers()["testSocket"].getGame()).to.be.undefined;
		room.startGames().then(afterGames);
		expect(room.getIsInGame()).to.be.true;
		expect(room.getPlayers()[clientSocket.id].getGame()).to.be.an.instanceOf(TetrisGame);
		expect(room.getPlayers()["testSocket"].getGame()).to.be.an.instanceOf(TetrisGame);
		expect(room.getPlayers()[clientSocket.id].getGame().opponent).to.equal(room.getPlayers()["testSocket"].getGame());
		expect(room.getPlayers()["testSocket"].getGame().opponent).to.equal(room.getPlayers()[clientSocket.id].getGame());
		room.players[clientSocket.id].getGame().setOver(true);
	});

});
