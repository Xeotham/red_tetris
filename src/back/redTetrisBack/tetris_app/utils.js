"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.isUpperCase = exports.codeNameExists = exports.getTetrisRoom = exports.deleteTetrisGame = exports.getTetrisGame = exports.getTetrisUser = void 0;

const controllers = require("./socket/controllers");


const getTetrisUser = (socketId) => {
	if (controllers.arcadeGames[socketId])
		return controllers.arcadeGames[socketId];
	return controllers.multiplayerRoomLst.find((room => room.getPlayers()[socketId]))?.getPlayers()[socketId];
};
exports.getTetrisUser = getTetrisUser;


const getTetrisGame = (socketId) => {
	if (controllers.arcadeGames[socketId]?.game)
		return controllers.arcadeGames[socketId].game;
	return controllers.multiplayerRoomLst.find((room => room.getGameById(socketId)))?.getGameById(socketId);
};
exports.getTetrisGame = getTetrisGame;


const deleteTetrisGame = (socketId) => {
	exports.getTetrisGame(socketId)?.setOver(true);
	if (controllers.arcadeGames[socketId])
		delete controllers.arcadeGames[socketId];
};
exports.deleteTetrisGame = deleteTetrisGame;


const getTetrisRoom = (roomCode) => {
	if (!roomCode)
		return undefined;
	return controllers.multiplayerRoomLst.find((room) => room.getCode() === roomCode);
};
exports.getTetrisRoom = getTetrisRoom;


const codeNameExists = (code) => {
	return !!(controllers.multiplayerRoomLst.find((room) => room.getCode() === code ));
};
exports.codeNameExists = codeNameExists;


const isUpperCase = (str) => {
	return /^[A-Z]+$/.test(str);
};
exports.isUpperCase = isUpperCase;


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
