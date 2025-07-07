"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.isUpperCase = exports.codeNameExists = exports.getTetrisRoom = exports.deleteTetrisGame = exports.getTetrisGame = void 0;
exports.idGenerator = idGenerator;

const controllers = require("./socket/controllers");

const getTetrisGame = (gameId) => {
	if (controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId))
		return controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId);
	return controllers.multiplayerRoomLst.find((room => room.getGameById(gameId)))?.getGameById(gameId);
};
exports.getTetrisGame = getTetrisGame;

const deleteTetrisGame = (gameId) => {
	(0, exports.getTetrisGame)(gameId)?.setOver(true);
	if (controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId))
		controllers.arcadeGamesLst.splice(controllers.arcadeGamesLst.indexOf(controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId)), 1);
};
exports.deleteTetrisGame = deleteTetrisGame;

const getTetrisRoom = (roomCode) => {
	if (!roomCode)
		return undefined;
	return controllers.multiplayerRoomLst.find((room) => room.getCode() === roomCode);
};
exports.getTetrisRoom = getTetrisRoom;

const codeNameExists = (code) => {
	return controllers.multiplayerRoomLst.find((room) => { return room.getCode() === code; });
};
exports.codeNameExists = codeNameExists;

const isUpperCase = (str) => {
	return /^[A-Z]+$/.test(str);
};
exports.isUpperCase = isUpperCase;

function* idGenerator() {
	let id = 0;
	while (true) {
		yield id++;
	}
	return id;
}

class    TimeoutKey {

	constructor(callback, delay) {
		this.start = Date.now();
		this.timer = setTimeout(callback, delay);
		this.remaining = delay;
		this.callback = callback;
	}
	pause() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining -= Date.now() - this.start;
	}
	resume() {
		if (this.timer !== 0) {
			return ;
		}
		this.start = Date.now();
		this.timer = setTimeout(this.callback, this.remaining);
	}
	clear() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining = 0;
		this.start = 0;
		this.callback = () => {};
	}
}
exports.TimeoutKey = TimeoutKey;

class User {
	constructor() {
		this.moveLeft = { timeout: null, firstMove: true };
		this.moveRight = { timeout: null, firstMove: true };

		this.keys = {};
		this.keys.moveLeft = "a";
		this.keys.moveRight = "d";
		this.keys.rotateClockwise = "arrowright";
		this.keys.rotateCounterClockwise = "arrowleft";
		this.keys.rotate180 = "w";
		this.keys.hardDrop = "arrowup";
		this.keys.softDrop = "arrowdown";
		this.keys.hold = "shift";
		this.keys.forfeit = "escape";
		this.keys.retry = "r";

		this.game = null;
	}

	isFirstMove(direction) {
		direction = (direction === this.keys.moveLeft ? "moveleft" : "moveright");

	}
}
exports.User = User;
