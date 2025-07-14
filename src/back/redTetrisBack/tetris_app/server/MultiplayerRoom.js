"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoom = void 0;

const utils = require("../utils");
const { MultiplayerRoomPlayer } = require("./MultiplayerRoomPlayer");
const { dlog } = require("./../../server/server");


class MultiplayerRoom {

	constructor(socket, isPrivate = true, codeName = undefined) {
		this.players = {}; // { socketId: MultiplayerRoomPlayer }
		this.isInGame = false;
		if (codeName && codeName.length === 4 && utils.isUpperCase(codeName) && !utils.codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.#generateInviteCode();
		dlog("The code of the new room is " + this.code);
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
			"resetSeedOnRetry": true,
			"seed": Date.now().toString(),
		};
		this.addPlayer(socket);
	}

	getIsInGame() { return this.isInGame; }
	getPlayers() { return this.players; }
	isPrivate() { return this.settings.isPrivate == undefined ? false : this.settings.isPrivate; }
	getIsVersus() { return this.settings.isVersus == undefined ? false : this.settings.isVersus; }
	getCode() { return this.code; }

	changeCode() { this.code = this.#generateInviteCode(); }
	setSettings(settings) { this.settings = settings; this.sendSettingsToPlayers(); }
	addSetting(key, value) { this.settings[key] = value; this.sendSettingsToPlayers(); }
	addSettings(settings) {
		for (const key in settings)
			this.settings[key] = settings[key];
		this.sendSettingsToPlayers();
	}

	addPlayer(socket) {
		if (this.players[socket.id]) {
			socket.emit("MULTIPLAYER_LEAVE");
			return dlog("Player " + socket.id + " already exists in room " + this.code);
		}
		// console.log("sending MULTIPLAYER_JOIN to " + socket.id + " with code " + this.code);
		socket.emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
		// console.log("sending MULTIPLAYER_JOIN 2");
		if (Object.values(this.players).length <= 0) {
			this.players[socket.id] = new MultiplayerRoomPlayer(socket, true);
			socket.emit("MULTIPLAYER_JOIN_OWNER");
		}
		else {
			this.players[socket.id] = new MultiplayerRoomPlayer(socket);
			this.settings.canRetry = false;
		}
		this.sendSettingsToPlayers();
	}

	removePlayer(socket) {
		const player = this.players[socket.id];
		if (!player)
			return ;
		player.getGame()?.forfeit();
		player.getSocket()?.emit("MULTIPLAYER_LEAVE");
		const nonOwner = Object.values(this.players).find((aPlayer => !aPlayer.isOwner()));
		if (player.isOwner() && nonOwner !== undefined) {
			nonOwner.setOwner(true);
			nonOwner.getSocket().emit("MULTIPLAYER_JOIN_OWNER");
		}
		delete this.players[socket.id];
		if (Object.values(this.players).length <= 1)
			this.settings.canRetry = true;
		this.sendSettingsToPlayers();
	}

	isEmpty() {
		return Object.values(this.players).length <= 0;
	}

	getGameById(socketId) {
		return this.players[socketId]?.getGame() || undefined;
	}

	#generateInviteCode() {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const length = 4;
		let result = "";
		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		if (utils.codeNameExists(result))
			return this.#generateInviteCode();
		for (const player of Object.values(this.players))
			player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: result }));
		return result;
	}

	async startGames() {
		if (this.isInGame)
			return ;

		return new Promise((resolve) => {
		const playersArray = Object.values(this.players);
		this.playersRemaining = playersArray.length;
		this.isInGame = true;
		this.settings.isInRoom = true;

		for (const player of playersArray)
			player.setupGame(this.settings);
		this.#assignOpponents();
		for (const player of playersArray)
			player.getGame()?.gameLoop().then(() => endOfGame(player));

		const sendOpponentsGames = () => {
			const players = Object.values(this.players);
			for (let i = 0; i < players.length; ++i) {
				let lost = 0;
				let games = [];
				for (let j = i + 1; j - lost < 6; j++) {
					j %= players.length;
					if (j === i)
						break ;
					if (players[j].getGame()?.isOver() || players[j].getGame() === undefined) {
						++lost;
						continue ;
					}
					games.push(players[j]);
				}
				players[i].getSocket().emit("MULTIPLAYER_OPPONENTS_GAMES", JSON.stringify({ argument: games }));
			}
		};
		const interval = setInterval(sendOpponentsGames, 1000 / 10);

		const endOfGame = (player) => {
			const playerArrayEnd = Object.values(this.players);
			dlog("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining);
			player.getSocket().emit("MULTIPLAYER_FINISH", JSON.stringify({ argument: this.playersRemaining }));
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getUsername());
			if (this.playersRemaining === 1)
				playerArrayEnd.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			this.#assignOpponents();
			if (this.playersRemaining >= 1)
				return;
			this.isInGame = false;
			playerArrayEnd.forEach((player) => {
				player.getSocket().emit("GAME_FINISH");
				if (!player.getGame()?.getHasForfeit())
					player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
				player.setGame(undefined);
			});
			this.sendSettingsToPlayers();
			clearInterval(interval);
			resolve(); // All games are over, resolve the promise
		};
		});
	}

	#assignOpponents() {
		const playersArray = Object.values(this.players);
		if (this.playersRemaining <= 1 || playersArray.length <= 1)
			return ;
		let opponent;
		for (const player of playersArray) {
			let tries = 0;
			do {
				opponent = playersArray[Math.floor(Math.random() * playersArray.length)];
				++tries;
				if (tries > 100)
					break ;
			} while (opponent === undefined || opponent === player ||
					opponent.getGame() === undefined || opponent.getGame()?.isOver() ||
					opponent.getGame()?.getHasForfeit());
			player.getGame()?.setOpponent(opponent.getGame());
		}
	}

	sendSettingsToPlayers() {
		const playersArray = Object.values(this.players);
		this.settings.nbPlayers = playersArray.length;
		for (const player of playersArray) {
			player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: "SETTINGS", value: this.settings }));
		}
	}
}
exports.MultiplayerRoom = MultiplayerRoom;
