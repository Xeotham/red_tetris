const assert = require('assert');
const chai = require('chai');
const { isUpperCase, getTetrisGame, getTetrisUser, deleteTetrisGame, getTetrisRoom, codeNameExists, TimeoutKey } = require("../tetris_app/utils");
const { io } = require("socket.io-client");
const { Player } = require("../tetris_app/server/Player");
const controllers = require("../tetris_app/socket/controllers");
const { MultiplayerRoom } = require("../tetris_app/server/MultiplayerRoom");
const { TetrisGame } = require("../tetris_app/server/Game/TetrisGame");

const expect = chai.expect;
const should = chai.should();


describe('TetrisUtils', () => {

	let clientSocket;

	before((done) => {
		clientSocket = io(`http://${process.env.ADDR + ":" + process.env.BACK_PORT}`, { transports: ['websocket'] });
		clientSocket.on('connect', done);
	});

	after(() => {
		// console.log("Disconnecting client socket...");
		if (clientSocket.connected) clientSocket.disconnect();
	});

	it('Should return the user inside arcadeGames or multiplayerRoomLst', () => {
		const player = new Player(clientSocket, true);
		controllers.arcadeGames[clientSocket.id] = player;
		expect(controllers.arcadeGames[clientSocket.id]).to.equal(player);
		expect(controllers.arcadeGames[clientSocket.id]).to.equal(getTetrisUser(clientSocket.id));
		expect(getTetrisUser("nonExistentSocketId")).to.equal(undefined);
		delete controllers.arcadeGames[clientSocket.id];
		expect(getTetrisUser(clientSocket.id)).to.equal(undefined);
		const room = new MultiplayerRoom(clientSocket);
		controllers.multiplayerRoomLst.push(room);
		expect(getTetrisUser(clientSocket.id)).to.equal(room.getPlayers()[clientSocket.id]);
		expect(getTetrisUser("nonExistentSocketId")).to.equal(undefined);
		controllers.multiplayerRoomLst.splice(controllers.multiplayerRoomLst.indexOf(room), 1);
		expect(getTetrisUser(clientSocket.id)).to.equal(undefined);
	});

	it('Should return the game inside arcadeGames or multiplayerRoomLst with a given Id', () => {
		const player = new Player(clientSocket, true);
		const game = new TetrisGame(clientSocket);
		player.setGame(game);
		controllers.arcadeGames[clientSocket.id] = player;
		expect(controllers.arcadeGames[clientSocket.id].getGame()).to.equal(game);
		expect(getTetrisGame(clientSocket.id)).to.equal(game);
		expect(getTetrisGame("nonExistentSocketId")).to.equal(undefined);
		delete controllers.arcadeGames[clientSocket.id];
		expect(getTetrisGame(clientSocket.id)).to.equal(undefined);
		const room = new MultiplayerRoom(clientSocket);
		room.getPlayers()[clientSocket.id].setGame(game);
		controllers.multiplayerRoomLst.push(room);
		expect(getTetrisGame(clientSocket.id)).to.equal(game);
		expect(getTetrisGame("nonExistentSocketId")).to.equal(undefined);
		room.removePlayer(clientSocket);
		controllers.multiplayerRoomLst.splice(controllers.multiplayerRoomLst.indexOf(room), 1);
		expect(getTetrisGame(clientSocket.id)).to.equal(undefined);
	});

	it('Should delete the game for a given Id', () => {
		const player = new Player(clientSocket, true);
		const game = new TetrisGame(clientSocket);
		player.setGame(game);
		controllers.arcadeGames[clientSocket.id] = player;
		expect(controllers.arcadeGames[clientSocket.id].getGame()).to.equal(game);
		deleteTetrisGame(clientSocket.id);
		expect(controllers.arcadeGames).to.not.have.property(clientSocket.id);
	});

	it('Should return the room with a given code', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(getTetrisRoom("nonExistentCode")).to.be.undefined;
		expect(getTetrisRoom("TEST")).to.be.undefined;
		controllers.multiplayerRoomLst.push(room);
		expect(getTetrisRoom("nonExistentCode")).to.be.undefined;
		controllers.multiplayerRoomLst.splice(controllers.multiplayerRoomLst.indexOf(room), 1);
		expect(getTetrisRoom("TEST")).to.equal(undefined);
	});

	it('Should return true if the code name already exists', () => {
		const room = new MultiplayerRoom(clientSocket, true, "TEST");
		expect(codeNameExists("nonExistentCode")).to.be.false;
		expect(codeNameExists("TEST")).to.be.false;
		controllers.multiplayerRoomLst.push(room);
		expect(codeNameExists("TEST")).to.be.true;
		controllers.multiplayerRoomLst.splice(controllers.multiplayerRoomLst.indexOf(room), 1);
		expect(codeNameExists("TEST")).to.be.false;
	});

	it('Should return true for an uppercase string', () => {
		expect(isUpperCase("TEST")).to.be.true;
		expect(isUpperCase("")).to.be.false;
		expect(isUpperCase("AAAAAAAAAAAAAA")).to.be.true;
		expect(isUpperCase("JAVASCRIPT")).to.be.true;
		expect(isUpperCase(".")).to.be.false;
		expect(isUpperCase("aBCd")).to.be.false;
		expect(isUpperCase("AbcD")).to.be.false;
		expect(isUpperCase("ASD1ASD")).to.be.false;
		expect(isUpperCase("123")).to.be.false;
		expect(isUpperCase("ASD123ASD")).to.be.false;
	});

	it('Should return a TimeoutKey object with the correct properties', () => {
		const callback = () => {};
		const delay = 10;
		const timeoutKey = new TimeoutKey(callback, delay);
		expect(timeoutKey).to.have.property('start').that.is.a('number');
		expect(timeoutKey).to.have.property('timer').that.is.a('object');
		expect(timeoutKey).to.have.property('remaining').that.is.a('number');
		expect(timeoutKey).to.have.property('callback').that.equals(callback);
		timeoutKey.pause();
		expect(timeoutKey.timer).to.equal(0);
		expect(timeoutKey.remaining).to.be.lessThanOrEqual(delay);
	});

	it('Should pause the timeout and update remaining time', () => {
		const callback = () => {};
		const delay = 100;
		const timeoutKey = new TimeoutKey(callback, delay);
		timeoutKey.pause();
		expect(timeoutKey.timer).to.equal(0);
		expect(timeoutKey.remaining).to.be.lessThanOrEqual(delay);
	});

	it('Should resume the timeout and reset the start time', (done) => {
		const callback = () => {
			done();
		};
		const delay = 10;
		const timeoutKey = new TimeoutKey(callback, delay);
		timeoutKey.pause();
		setTimeout(() => {
			timeoutKey.resume();
			expect(timeoutKey.start).to.be.greaterThan(0);
		}, 5);
	});

	it('Should clear the timeout and reset all properties', () => {
		const callback = () => {};
		const delay = 10;
		const timeoutKey = new TimeoutKey(callback, delay);
		timeoutKey.clear();
		expect(timeoutKey.timer).to.equal(0);
		expect(timeoutKey.remaining).to.equal(0);
		expect(timeoutKey.start).to.equal(0);
		expect(timeoutKey.callback).to.be.a('function');
	});

});
