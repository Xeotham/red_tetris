"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoom = void 0;

const utils = require("../utils");
const MultiplayerRoomPlayer = require("./MultiplayerRoomPlayer");


class MultiplayerRoom {

	constructor(socket, username, isPrivate = false, codeName = undefined) {
		this.players = [];
		this.isInGame = false;
		if (codeName && codeName.length === 4 && (0, utils.isUpperCase)(codeName) && !(0, utils.codeNameExists)(codeName))
			this.code = codeName;
		else
			this.code = this.generateInviteCode();
		console.log("The code of the new room is " + this.code);
		this.playersRemaining = 0;
		this.settings = {
			"isPrivate": true,
			"isVersus": false,
			"showShadowPiece": true,
			"showBags": true,
			"holdAllowed": true,
			"showHold": true,
			"infiniteHold": false,
			"infiniteMovement": false,
			"lockTime": 500,
			"spawnARE": 0,
			"softDropAmp": 1.5,
			"level": 4,
			"isLevelling": false,
			"canRetry": true,
		};
		this.addPlayer(socket, username);
	}

	getIsInGame() { return this.isInGame; }
	getPlayers() { return this.players; }
	isPrivate() { return this.settings.isPrivate == undefined ? false : this.settings.isPrivate; }
	getIsVersus() { return this.settings.isVersus == undefined ? false : this.settings.isVersus; }
	getCode() { return this.code; }

	changeCode() { this.code = this.generateInviteCode(); }
	setSettings(settings) { this.settings = settings; this.sendSettingsToPlayers(); }
	addSetting(key, value) { this.settings[key] = value; this.sendSettingsToPlayers(); }
	addSettings(settings) {
		for (const key in settings)
			this.settings[key] = settings[key];
		this.sendSettingsToPlayers();
	}

	addPlayer(socket, username) {
		if (this.players.find((player) => player.getUsername() === username)) {
			socket.send(JSON.stringify({ type: "MULTIPLAYER_LEAVE" }));
			return console.log("Player " + username + " already exists in room " + this.code);
		}
		if (this.players.length <= 0) {
			socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }));
			this.players.push(new MultiplayerRoomPlayer.MultiplayerRoomPlayer(socket, username, true));
		}
		else {
			this.players.push(new MultiplayerRoomPlayer.MultiplayerRoomPlayer(socket, username));
			this.settings.canRetry = false;
		}
		socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
		this.sendSettingsToPlayers();
	}

	removePlayer(username) {
		const player = this.players.find((player) => player.getUsername() === username);
		if (!player)
			return;
		player.getGame()?.forfeit();
		player.getSocket()?.send(JSON.stringify({ type: "MULTIPLAYER_LEAVE" }));
		this.players.splice(this.players.indexOf(player), 1);
		const nonOwner = this.players.find((aPlayer => !aPlayer.isOwner()));
		if (player.isOwner() && nonOwner !== undefined) {
			nonOwner.setOwner(true);
			nonOwner.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }));
		}
		if (this.players.length === 1)
			this.settings.canRetry = true;
		this.sendSettingsToPlayers();
	}

	isEmpty() {
		return this.players.length <= 0;
	}

	getGameById(id) {
		return this.players.find((player) => player.getGame()?.getGameId() === id)?.getGame();
	}

	generateInviteCode() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const length = 4;
		let result = "";
		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		if ((0, utils.codeNameExists)(result))
			return this.generateInviteCode();
		for (const player of this.players) {
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: result }));
		}
		return result;
	}

	startGames() {
		if (this.isInGame)
			return;
		this.playersRemaining = this.players.length;
		this.isInGame = true;
		this.settings.isInRoom = true;
		for (const player of this.players)
			player.setupGame(this.settings);
		this.assignOpponents();
		for (const player of this.players)
			player.getGame()?.gameLoop().then(() => endOfGame(player));
		const sendOpponentsGames = () => {
			for (let i = 0; i < this.players.length; ++i) {
				let lost = 0;
				let games = [];
				for (let j = i + 1; j - lost < 6; ++j) {
					j %= this.players.length;
					if (j === i)
						break;
					if (this.players[j].getGame()?.isOver() || this.players[j].getGame() === undefined) {
						++lost;
						continue;
					}
					games.push(this.players[j].getGame()?.toJSON());
				}
				this.players[i].getSocket().send(JSON.stringify({ type: "MULTIPLAYER_OPPONENTS_GAMES", argument: games }));
			}
		};
		const interval = setInterval(sendOpponentsGames, 1000 / 10);
		const endOfGame = (player) => {
			console.log("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining);
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_FINISH", argument: this.playersRemaining }));
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getUsername());
			if (this.playersRemaining === 1)
				this.players.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			this.assignOpponents();
			if (this.playersRemaining >= 1)
				return;
			this.players.forEach((player) => {
				player.getSocket().send(JSON.stringify({ type: "GAME_FINISH" }));
				if (!player.getGame()?.getHasForfeit())
					player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
				player.setGame(undefined);
			});
			this.sendSettingsToPlayers();
			this.isInGame = false;
			clearInterval(interval);
		};
	}

	assignOpponents() {
		if (this.playersRemaining <= 1 || this.players.length <= 1)
			return;
		let opponent;
		for (const player of this.players) {
			do {
				opponent = this.players[Math.floor(Math.random() * this.players.length)];
			} while (opponent === undefined || opponent === player ||
			opponent.getGame() === undefined || opponent.getGame()?.isOver() || opponent.getGame()?.getHasForfeit());
			player.getGame()?.setOpponent(opponent.getGame());
		}
	}

	sendSettingsToPlayers() {
		this.settings.nbPlayers = this.players.length;
		for (const player of this.players) {
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "SETTINGS", value: this.settings }));
		}
	}
}
exports.MultiplayerRoom = MultiplayerRoom;
