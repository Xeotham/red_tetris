"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdPiece = exports.dropPiece = exports.rotatePiece = exports.movePiece = exports.forfeitGame = exports.retryGame = exports.tetrisArcade = exports.multiplayerRoomLst = exports.arcadeGames = void 0;

const utils = require("../utils");
const { TetrisGame } = require("../server/Game/TetrisGame");
const { MultiplayerRoomPlayer } = require("../server/MultiplayerRoomPlayer");
const { MultiplayerRoom } = require("../server/MultiplayerRoom");
const {deleteTetrisGame} = require("../utils");

exports.arcadeGames = {}; // { socketId: MultiplayerRoomPlayer }
exports.multiplayerRoomLst = []; // [MultiplayerRoom]

const tetrisArcade = async (socket) => {
	const tetrisGame = new TetrisGame(socket);
	console.log("Arcade Game started for", socket.id);
	exports.arcadeGames[socket.id] = new MultiplayerRoomPlayer(socket, true);
	exports.arcadeGames[socket.id].setGame(tetrisGame);
	tetrisGame.gameLoop().then(() => exports.arcadeGames[socket.id].game = null);
	// TODO : Delete the player or close the socket? Send a message to the player?
};
exports.tetrisArcade = tetrisArcade;


const joinMultiplayerRoom = async (socket, roomCode) => {
	const room = utils.getTetrisRoom(roomCode);
	if (!room)
		return exports.multiplayerRoomLst.push(new MultiplayerRoom(socket, true, roomCode));
	room.addPlayer(socket);
}
exports.joinMultiplayerRoom = joinMultiplayerRoom;


const quitMultiplayerRoom = async (socket, roomCode) => {
	deleteTetrisGame(socket.id);
	const room = utils.getTetrisRoom(roomCode);
	if (room) {
		console.log("Quit room with code : " + room.getCode() + " for player : " + socket.id);
		room.removePlayer(socket);
		if (room.isEmpty())
			exports.multiplayerRoomLst.splice(exports.multiplayerRoomLst.indexOf(room), 1);
	}
}
exports.quitMultiplayerRoom = quitMultiplayerRoom;


const dropPiece = async (dropType, user, keyType) => {
	const game = user.game;
	if (!game)
		return ;
	// TODO: Add error.
	dropType = (dropType === user.keys.hardDrop ? "hard" : "soft");
	if (dropType === "soft" && keyType === "keyUp")
		dropType = "normal";
	game?.changeFallSpeed(dropType);
};


const   movePiece = (direction, user, keyType) => {
	const   arg = direction === user.keys.moveLeft ? user.moveLeft : user.moveRight;
	const   opposite = direction === user.keys.moveLeft ? user.moveRight : user.moveLeft;

	if (keyType === "keyUp") {
		arg.firstMove = true;
		arg.timeout.clear();
		if (opposite.timeout != null)
			opposite.timeout.resume();
		return ;
	}
	if (opposite.timeout != null && !opposite.firstMove) {
		opposite.timeout?.pause();
	}
	const   repeat = async () => {
		user.game?.move(direction === user.keys.moveLeft ? "left" : "right");
		if (arg.firstMove) {
			arg.firstMove = false;
			arg.timeout = new utils.TimeoutKey(repeat, 150);
		}
		else {
			arg.timeout?.clear();
			arg.timeout = new utils.TimeoutKey(repeat, 40);
		}
	}
	repeat();
}


const keyDown = async (key, socket) => {
	const user = utils.getTetrisUser(socket.id);
	if (!user || !user.game)
		return; // TODO : Add error.
	key = key.toLowerCase();

	switch (key) {
		case user.keys.rotateClockwise:
		case user.keys.rotateCounterClockwise:
		case user.keys.rotate180:
			const direction = (key === user.keys.rotateClockwise ? "clockwise" :
				(key === user.keys.rotateCounterClockwise ? "counter-clockwise" : "180"));
			user.game?.rotate(direction);
			// rotatePiece(key, user, "keyDown");
			break ;
		case user.keys.moveLeft:
		case user.keys.moveRight:
			movePiece(key, user, "keyDown");
			break ;
		case user.keys.hardDrop:
		case user.keys.softDrop:
			dropPiece(key, user, "keyDown");
			break ;
		case user.keys.hold:
			user.game?.swap();
			break ;
		case user.keys.forfeit:
			user.game?.forfeit();
			break ;
		case user.keys.retry:
			user.game?.retry();
			break ;
	}
}
exports.keyDown = keyDown;


const keyUp = async (key, socket) => {
	const user = utils.getTetrisUser(socket.id);
	if (!user || !user.game)
		return; // TODO : Add error.
	key = key.toLowerCase();

	switch (key) {
		case user.keys.moveLeft:
		case user.keys.moveRight:
			movePiece(key, user, "keyUp");
			break;
		case user.keys.softDrop:
			dropPiece(key, user, "keyUp");
			break;
	}
}
exports.keyUp = keyUp;
