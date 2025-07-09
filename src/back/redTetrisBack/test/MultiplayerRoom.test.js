const assert = require('assert');
const chai = require('chai');
const { MultiplayerRoom } = require('./../tetris_app/server/MultiplayerRoom.js');
const { io, Socket } = require("socket.io-client");
const { address } = require("../server/server");
const { TetrisGame } = require("../tetris_app/server/Game/TetrisGame");

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
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getIsInGame()).to.be.false;
		room.startGames();
		expect(room.getIsInGame()).to.be.true;
		room.players[clientSocket.id].getGame().setOver(true);
		clientSocket.once('GAME_FINISH', () => { expect(room.getIsInGame()).to.be.false; });
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
		clientSocket.once('MULTIPLAYER_JOIN', (data) => {
			expect(JSON.parse(data).argument).to.equal("TEST");
			done();
		});
		// clientSocket.once('MULTIPLAYER_JOIN', (data) => {
		// 	console.log("In MULTIPLAYER_JOIN");
		// 	expect(data.argument).to.equal(room.getCode());
		// });
		// clientSocket.once('MULTIPLAYER_JOIN_OWNER', (data) => {
		// 	console.log("In MULTIPLAYER_JOIN_OWNER");
		// 	expect(room.getPlayers()[clientSocket.id]?.isOwnner()).to.be.true;
		// });
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(room.getPlayers()).to.have.property(clientSocket.id);
		// room.addPlayer(clientSocket);
	});

});
