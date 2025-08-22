"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerRoom = void 0;

const utils = require("../utils");
const { Player } = require("./Player");
const { dlog } = require("./../../server/server");
const controllers = require("../socket/controllers");


class MultiplayerRoom {

	constructor(socket, isPrivate = true, codeName = undefined) {
		this.players = {}; // { socketId: Player }
		this.opponentsOrder = [] // [Player] The player sends garbage to the next player in the array and thus receives garbage from the previous player
		this.noLoserList = []; // [Player]
		this.isInGame = false;
		if (codeName && codeName.length === 4 && utils.isUpperCase(codeName) && !utils.codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.#generateInviteCode();
		dlog("The code of the new Room is " + this.code);
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
			"rotationSystem": "SRS-X",
			"lockTime": 500,
			"spawnARE": 0,
			"softDropAmp": 1.5,
			"level": 4,
			"isLevelling": false,
			"canRetry": true,
			"music": "bgm1.mp3",
			"seed": Date.now().toString(),
			"resetSeedOnRetry": true,
			"nbPlayers": 1,
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
			return dlog("Player " + socket.id + " already exists in Room " + this.code);
		}
		// console.log("sending MULTIPLAYER_JOIN to " + socket.id + " with code " + this.code);
		socket.emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
		// console.log("sending MULTIPLAYER_JOIN 2");
		if (Object.values(this.players).length <= 0) {
			this.players[socket.id] = new Player(socket, true);
			socket.emit("MULTIPLAYER_OWNER", JSON.stringify(true))
		}
		else {
			this.players[socket.id] = new Player(socket);
			if (Object.values(this.players).length === 2)
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
			nonOwner.getSocket()?.emit("MULTIPLAYER_OWNER", JSON.stringify(true));
		}
		delete this.players[socket.id];
		if (Object.values(this.players).length <= 1 && !this.settings.canRetry)
			this.settings.canRetry = true;
		this.sendSettingsToPlayers();
	}

	isPlayerInRoom(socketId) {
		return !!this.players[socketId];
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
			return;

		return new Promise((resolve) => {
		const playersArray = Object.values(this.players);
		this.playersRemaining = playersArray.length;
		this.isInGame = true;
		this.settings.isInRoom = true;

		// this.opponentsOrder = playersArray.filter(player => !player.getGame()?.isOver() && player.getGame() !== undefined);
		this.opponentsOrder = playersArray.concat([]).sort(() => Math.random() - 0.5); // Deep copy of the array (not the players)

		for (const player of playersArray)
			player.setupGame(this.settings);
		this.#assignOpponents();
		for (const player of playersArray)
			player.getGame()?.gameLoop().then(() => endOfGame(player));

		const sendOpponentsGames = () => {
			for (let i = 0; i < this.opponentsOrder.length; ++i) {
				let player = this.opponentsOrder[i];
				if (player.getGame() === undefined || player.getGame()?.isOver()) {
					for (let j = 1; j < this.opponentsOrder.length; ++j) {
						const newPlayer = this.opponentsOrder[(i + j) % this.opponentsOrder.length];
						if (!newPlayer?.getGame()?.isOver()) {
							player = newPlayer;
							break ;
						}
					}
				}
				const games = [
					this.noLoserList[(this.noLoserList.indexOf(player) - 1) % this.noLoserList.length],
					this.noLoserList[(this.noLoserList.indexOf(player) + 1) % this.noLoserList.length]
				];
				player.getSocket().emit("MULTIPLAYER_OPPONENTS_GAMES", JSON.stringify({ argument: games }));
			}

			// const players = Object.values(this.players);
			// for (let i = 0; i < players.length; ++i) {
			// 	let lost = 0;
			// 	let games = [];
			// 	for (let j = i + 1; j - lost < 6; j++) {
			// 		j %= players.length;
			// 		if (j === i)
			// 			break ;
			// 		if (players[j].getGame()?.isOver() || players[j].getGame() === undefined) {
			// 			++lost;
			// 			continue ;
			// 		}
			// 		games.push(players[j].toJSON());
			// 	}
			// 	players[i].getSocket().emit("MULTIPLAYER_OPPONENTS_GAMES", JSON.stringify({ argument: games }));
			// }
		};
		const interval = setInterval(sendOpponentsGames, 1000 / 10);

		const endOfGame = (player) => {
			const playerArrayEnd = Object.values(this.players);
			dlog("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining + " in Room " + this.code);
			player.getGame().place = this.playersRemaining;
			player.getSocket().emit("MULTIPLAYER_FINISH", JSON.stringify({ argument: this.playersRemaining }));
			controllers.keyUp(player.keys.moveLeft, player.getSocket());
			controllers.keyUp(player.keys.moveRight, player.getSocket());
			controllers.keyUp(player.keys.softDrop, player.getSocket());
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getUsername());
			if (this.playersRemaining === 1)
				playerArrayEnd.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			this.#assignOpponents();
			if (this.playersRemaining >= 1)
				return ;
			this.isInGame = false;
			playerArrayEnd.forEach((player) => {
				player.getSocket().emit("GAME_FINISH");
				if (!player.getGame()?.getHasForfeit())
					player.getSocket().emit("MULTIPLAYER_JOIN", JSON.stringify({ argument: this.code }));
				player.setGame(undefined);
			});
			this.sendSettingsToPlayers();
			clearInterval(interval);
			resolve();
		};
		});
	}

	#assignOpponents() {
		this.noLoserList = this.opponentsOrder.filter(player => !player.getGame()?.isOver() && player.getGame() !== undefined);
		if (this.noLoserList.length <= 1)
			return ;
		for (let i = 0; i < this.noLoserList.length; ++i) {
			this.noLoserList[i].getGame()?.setOpponent(
				this.noLoserList[(i + 1) % this.noLoserList.length].getGame());
		}
		// for (let i = 0; i < this.opponentsOrder.length; ++i) {
		// 	if (this.opponentsOrder[i].getGame() === undefined || this.opponentsOrder[i].getGame()?.isOver())
		// 		continue ;
		// 	for (let j = 1; j < this.opponentsOrder.length; ++j) {
		// 		if ((i + j) % this.opponentsOrder.length === i ||
		// 			this.opponentsOrder[(i + j) % this.opponentsOrder.length].getGame() === undefined ||
		// 			this.opponentsOrder[(i + j) % this.opponentsOrder.length].getGame()?.isOver())
		// 			continue ;
		// 		this.opponentsOrder[i].getGame()?.setOpponent(this.opponentsOrder[(i + j) % this.opponentsOrder.length].getGame());
		// 	}
		// }


		// const playersArray = Object.values(this.players);
		// if (this.playersRemaining <= 1 || playersArray.length <= 1)
		// 	return ;
		// let opponent;
		// for (const player of playersArray) {
		// 	let tries = 0;
		// 	do {
		// 		opponent = playersArray[Math.floor(Math.random() * playersArray.length)];
		// 		++tries;
		// 		if (tries > 100)
		// 			break ;
		// 	} while (opponent === undefined || opponent === player ||
		// 			opponent.getGame() === undefined || opponent.getGame()?.isOver() ||
		// 			opponent.getGame()?.getHasForfeit());
		// 	player.getGame()?.setOpponent(opponent.getGame());
		// }
	}

	sendSettingsToPlayers() {
		const playersArray = Object.values(this.players);
		this.settings.nbPlayers = playersArray.length;
		for (const player of playersArray)
			player.getSocket().emit("MULTIPLAYER_SETTINGS", JSON.stringify(this.settings));
	}
}
exports.MultiplayerRoom = MultiplayerRoom;
