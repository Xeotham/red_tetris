"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoomPlayer = void 0;

const TetrisGame = require("./Game/TetrisGame");


class MultiplayerRoomPlayer {
	constructor(socket, owner = false) {
		this.socket = socket;
		this.username = socket.id;
		this.owner = owner;
		this.game = undefined;

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

	}
	getSocket() { return this.socket; }
	getUsername() { return this.username; }
	isOwner() { return this.owner; }
	setOwner(owner) { this.owner = owner; }
	getGame() { return this.game; }
	setGame(game) { this.game = game; }

	setupGame(settings) {
		const game = new TetrisGame.TetrisGame(this.socket, this.username);
		game.setSettings(settings);
		this.game = game;
	}
}
exports.MultiplayerRoomPlayer = MultiplayerRoomPlayer;
