const assert = require('assert');
const chai = require('chai');
const controllers = require('../tetris_app/socket/controllers');
const { io } = require("socket.io-client");
const { delay } = require("../tetris_app/server/Game/utils");
const { getTetrisRoom, deleteTetrisGame } = require("../tetris_app/utils");
const tc = require("../tetris_app/server/Game/tetrisConstants");

const expect = chai.expect;
const should = chai.should();

async function waitForFallInterval(game, timeout = 1800) {
	const start = Date.now();
	while (game.fallInterval === -1) {
		if (Date.now() - start > timeout)
			throw new Error("Timeout waiting for fallInterval to be set took too long");
		await delay(1);
	}
}

describe('Controllers', () => {

	let socket;

	before((done) => {
		socket = io(`http://${process.env.ADDR + ":" + process.env.BACK_PORT}`);
		socket.on('connect', done);
	});

	after(() => {
		// console.log("Disconnecting client socket...");
		deleteTetrisGame(socket.id);
		if (socket.connected) socket.disconnect();
	});

	it('Should register a new arcade game', async () => {
		await controllers.tetrisArcade(socket);
		await waitForFallInterval(controllers.arcadeGames[socket.id].getGame());
		expect(controllers.arcadeGames[socket.id]).to.not.be.undefined;
		expect(controllers.arcadeGames[socket.id].getGame()).to.not.be.undefined;
		await deleteTetrisGame(socket.id);
	});

	it('Should Create or join a multiplayer Room', async () => {
		const roomExisted = !!getTetrisRoom(socket);
		await controllers.joinMultiplayerRoom(socket, "ABCD");
		const room = getTetrisRoom("ABCD");
		expect(room).to.not.be.undefined;
		expect(room.getPlayers()[socket.id]).to.not.be.undefined;
		if (!roomExisted)
			expect(room.getPlayers()[socket.id].isOwner()).to.equal(true);
		else
			expect(room.getPlayers()[socket.id].isOwner()).to.equal(false);
		expect(room.getCode()).to.equal("ABCD");
		controllers.quitMultiplayerRoom(socket, "ABCD");
	});

	it('Should quit an arcade game or multiplayer Room', async () => {
		await controllers.tetrisArcade(socket);
		await waitForFallInterval(controllers.arcadeGames[socket.id].getGame());
		expect(controllers.arcadeGames[socket.id]).to.not.be.undefined;
		await controllers.quitMultiplayerRoom(socket, undefined);
		expect(controllers.arcadeGames[socket.id]).to.be.undefined;
		await controllers.joinMultiplayerRoom(socket, "ABCD");
		const room = getTetrisRoom("ABCD");
		const isAlone = Object.keys(room.getPlayers()).length === 1;
		expect(room).to.not.be.undefined;
		await controllers.quitMultiplayerRoom(socket, "ABCD");
		if (isAlone)
			expect(controllers.multiplayerRoomLst.indexOf(room)).to.equal(-1);
	});

	it('Should react based on input', async () => {
		await controllers.tetrisArcade(socket, {resetSeedOnRetry: false});
		const user = controllers.arcadeGames[socket.id];
		expect(user).to.not.be.undefined;
		const game = user.getGame();
		expect(game).to.not.be.undefined;
		await waitForFallInterval(game);

		await controllers.keyDown(user.keys.rotateClockwise, socket);
		expect(game.currentPiece.getRotation()).to.equal(tc.EAST);
		await controllers.keyDown(user.keys.rotateCounterClockwise, socket);
		expect(game.currentPiece.getRotation()).to.equal(tc.NORTH);
		await controllers.keyDown(user.keys.rotateCounterClockwise, socket);
		expect(game.currentPiece.getRotation()).to.equal(tc.WEST);
		await controllers.keyDown(user.keys.rotate180, socket);
		expect(game.currentPiece.getRotation()).to.equal(tc.EAST);

		const initialPosition = game.currentPiece.getCoordinates();
		await controllers.keyDown(user.keys.moveLeft, socket);
		expect(game.currentPiece.getCoordinates().getX()).to.equal(initialPosition.getX() - 1);
		await controllers.keyDown(user.keys.moveRight, socket);
		expect(game.currentPiece.getCoordinates().getX()).to.equal(initialPosition.getX());
		await controllers.keyUp(user.keys.moveLeft, socket);
		await controllers.keyUp(user.keys.moveRight, socket);

		const actualPiece = game.currentPiece;
		expect(game.hold).to.be.undefined;
		await controllers.keyDown(user.keys.hold, socket);
		expect(game.hold).to.not.be.undefined;
		expect(game.hold).to.equal(actualPiece);
		expect(game.currentPiece).to.not.equal(actualPiece);

		await controllers.keyDown(user.keys.retry, socket);
		await waitForFallInterval(game);
		expect(game.currentPiece.getName()).to.equal(actualPiece.name);

		await controllers.keyDown(user.keys.hardDrop, socket);
		expect(game.dropType).to.equal("hard"); // Hard to test as it will quickly drop the piece and reset the dropType to "normal"
		await controllers.keyDown(user.keys.softDrop, socket);
		expect(game.dropType).to.equal("soft");
		await controllers.keyUp(user.keys.softDrop, socket);
		expect(game.dropType).to.equal("normal");

		await controllers.keyDown(user.keys.forfeit, socket);
		expect(game.isOver()).to.be.true;
		expect(game.getHasForfeit()).to.be.true;

		// await deleteTetrisGame(socket.id);
	});

});
