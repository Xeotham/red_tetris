const assert = require('assert');
const chai = require('chai');
const { MultiplayerRoomPlayer } = require('./../tetris_app/server/MultiplayerRoomPlayer.js');
const { io, Socket } = require("socket.io-client");
const { address } = require("../server/server");
const { TetrisGame } = require("../tetris_app/server/Game/TetrisGame");

const expect = chai.expect;
const should = chai.should();

describe('MultiplayerRoomPlayer', () => {

	let clientSocket;

	before((done) => {
		clientSocket = io(`http://${process.env.ADDR + ":" + process.env.BACK_PORT}`, { transports: ['websocket'] });
		clientSocket.on('connect', done);
	});

	after(() => {
		// console.log("Disconnecting client socket...");
		if (clientSocket.connected) clientSocket.disconnect();
	});

	it('should create a MultiplayerRoomPlayer with a socket', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		expect(player.getSocket().id).to.equal(clientSocket.id);
		expect(player.getUsername()).to.equal(clientSocket.id);
		expect(player.isOwner()).to.be.false;
		expect(player.getGame()).to.be.undefined;
	});

	it('Should get the socket', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		expect(player.getSocket()).to.equal(clientSocket);
	});

	it('Should get the username (socket id)', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		expect(player.getUsername()).to.equal(clientSocket.id);
	});

	it('Should set and get the owner status', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		expect(player.isOwner()).to.be.false;
		player.setOwner(true);
		expect(player.isOwner()).to.be.true;
	});

	it('Should set and get the game', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		expect(player.getGame()).to.be.undefined;
		const game = new TetrisGame(clientSocket);
		player.setGame(game);
		expect(player.getGame()).to.equal(game);
	});

	it('Should setup a game with settings', () => {
		const player = new MultiplayerRoomPlayer(clientSocket);
		const settings = {
			showBags: false,
			holdAllowed: false,
			showHold: false,
			infiniteHold: true,
			infiniteMovement: true,
			lockTime: 5000,
			spawnARE: 10,
			softDropAmp: 10,
			isLevelling: false,
			canRetry: false
		};
		const normalGame = new TetrisGame(clientSocket, player.getUsername());
		for (const key in settings)
			expect(normalGame[key]).to.not.equal(settings[key]);
		player.setupGame(settings);
		expect(player.getGame()).to.be.instanceOf(TetrisGame);
		const game = player.getGame();
		for (const key in settings)
			expect(game[key]).to.equal(settings[key]);
	});


});
