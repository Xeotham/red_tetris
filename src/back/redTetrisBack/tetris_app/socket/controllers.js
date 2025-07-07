"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdPiece = exports.dropPiece = exports.rotatePiece = exports.movePiece = exports.forfeitGame = exports.retryGame = exports.tetrisArcade = exports.multiplayerRoomLst = exports.arcadeGamesLst = void 0;

const utils = require("../utils");
const TetrisGame = require("../server/Game/TetrisGame");


exports.arcadeGamesLst = [];
exports.multiplayerRoomLst = [];
exports.users = {}; // { socketId: user }

const tetrisArcade = async (socket) => {
	const tetrisGame = new TetrisGame.TetrisGame(socket);
	console.log("Arcade Game started for", socket.id);
	exports.arcadeGamesLst.push(tetrisGame);
	exports.users[socket.id] = new utils.User();
	exports.users[socket.id].game = tetrisGame;
	tetrisGame.gameLoop().then(() => exports.users[socket.id].game = null);
};
exports.tetrisArcade = tetrisArcade;


const rotatePiece = async (direction, user) => {
	const game = user.game;
	if (!game)
		return; //TODO: Add error.
	direction = (direction === user.keys.rotateClockwise ? "clockwise" :
		(direction === user.keys.rotateCounterClockwise ? "counter-clockwise" : "180"));
	return game?.rotate(direction);
};

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
	const user = exports.users[socket.id];
	if (!user || !utils.getTetrisGame(socket.id))
		return; // TODO : Add error.
	key = key.toLowerCase();

	switch (key) {
		case user.keys.moveLeft:
		case user.keys.moveRight:
			movePiece(key, user, "keyDown");
			break ;
		case user.keys.rotateClockwise:
		case user.keys.rotateCounterClockwise:
		case user.keys.rotate180:
			rotatePiece(key, user, "keyDown");
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
	const user = exports.users[socket.id];
	if (!user || !utils.getTetrisGame(socket.id))
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
