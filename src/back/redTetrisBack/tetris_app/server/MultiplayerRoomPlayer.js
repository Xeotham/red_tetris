"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoomPlayer = void 0;

const TetrisGame = require("./TetrisGame");


class MultiplayerRoomPlayer {
	constructor(socket, username, owner = false) {
		this.socket = socket;
		this.username = username;
		this.owner = owner;
		this.left = false;
		this.game = undefined;
	}
	getSocket() { return this.socket; }
	getUsername() { return this.username; }
	isOwner() { return this.owner; }
	hasLeft() { return this.left; }
	getGame() { return this.game; }
	setOwner(owner) { this.owner = owner; }
	setLeft(left) { this.left = left; }
	setGame(game) { this.game = game; }
	setupGame(settings) {
		const game = new TetrisGame.TetrisGame(this.socket, this.username);
		game.setSettings(settings);
		this.game = game;
	}
}
exports.MultiplayerRoomPlayer = MultiplayerRoomPlayer;
