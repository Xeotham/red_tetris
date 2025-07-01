"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdPiece = exports.dropPiece = exports.rotatePiece = exports.movePiece = exports.forfeitGame = exports.retryGame = exports.tetrisArcade = exports.multiplayerRoomLst = exports.arcadeGamesLst = void 0;

const utils = require("../utils");
const TetrisGame = require("../server/Game/TetrisGame");


exports.arcadeGamesLst = [];
exports.multiplayerRoomLst = [];

// export const    tetrisMatchmaking = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
// 	if (!req.query.username)
// 		return console.log("No username");
//
// 	for (const room of multiplayerRoomLst) {
// 		if (room.getIsInGame() || room.isPrivate() || !room.getIsVersus() || room.getPlayers().length >= 2)
// 			continue ;
// 		console.log("Joining existing room with code: " + room.getCode());
// 		room.addPlayer(socket, req.query.username);
// 		return ;
// 	}
//
// 	console.log("No room found, creating a new room");
//
// 	const room = new MultiplayerRoom(socket, req.query.username, false);
// 	room.addSettings( {"isVersus": true, "isPrivate": false} );
// 	multiplayerRoomLst.push(room);
// }

const tetrisArcade = async (socket) => {
    const tetrisGame = new TetrisGame.TetrisGame(socket);
    console.log("Arcade Game started for", socket.id);
    exports.arcadeGamesLst.push(tetrisGame);
    tetrisGame.gameLoop();
};
exports.tetrisArcade = tetrisArcade;

// export const    tetrisCreateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code?: string | undefined}}>) => {
// 	const request = req.query;
// 	if (!request)
// 		return;
//
// 	const room = new MultiplayerRoom(socket, request.username, false, request.code);
// 	multiplayerRoomLst.push(room);
// }
//
// export const	getMultiplayerRooms = async (request: FastifyRequest, reply: FastifyReply) => {
// 	let rooms: {roomCode: string, nbPlayers: number}[] = [];
//
// 	for (const room of multiplayerRoomLst) {
// 		if (room.isPrivate())
// 			continue ;
// 		rooms.push({roomCode: room.getCode(), nbPlayers: room.getPlayers().length});
// 	}
// 	return reply.send(rooms);
// }
//
// export const    tetrisJoinRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code: string}}>) => {
// 	const request = req.query;
// 	if (!request)
// 		return ;
// 	const room = getTetrisRoom(request.code);
// 	if (!room)
// 		return tetrisCreateRoom(socket, req);
//
// 	room.addPlayer(socket, request.username);
// }
//
// export const    tetrisRoomCommand = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
// 	const request: tetrisReq = req.body;
// 	if (!request)
// 		return reply.status(400).send({message: "No body"});
//
// 	const room = getTetrisRoom(request.roomCode);
// 	if (!room)
// 		return reply.status(400).send({message: "Room not found"});
//
// 	switch (request.argument) {
// 		case "start":
// 			room.startGames();
// 			break ;
// 		case "settings":
// 			room.setSettings(request.prefix);
// 			break ;
// 	}
// 	reply.status(200).send({message: "Command received"});
// }
//
// export const    tetrisQuitRoom = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
// 	try {
// 		const   request: tetrisReq = req.body;
// 		if (!request)
// 			return reply.status(400).send({message: "No body"});
// 		if (!request.username)
// 			return reply.status(400).send({message: "No username"});
//
// 		deleteTetrisGame(request.gameId);
// 		const room = getTetrisRoom(request.roomCode);
// 		if (room) {
// 			console.log("Tetris QuitRoom with code : " + request?.roomCode + " for " + request?.username);
// 			room.removePlayer(request.username);
// 			if (room.isEmpty())
// 				multiplayerRoomLst.splice(multiplayerRoomLst.indexOf(room), 1);
// 		}
// 		reply.status(200).send({message: "Quitting the room"});
// 	}
// 	catch (error) {
// 		console.error("Error in tetrisQuitRoom:", error);
// 		return reply.status(500).send({message: "Error in tetrisQuitRoom"});
// 	}
// }

const retryGame = async (socket) => {
    let game = (0, utils.getTetrisGame)(socket.id);
    //TODO: Add error.
    game?.retry();
};
exports.retryGame = retryGame;

const forfeitGame = async (socket) => {
    const game = (0, utils.getTetrisGame)(socket.id);
    //TODO: Add error.
    game?.forfeit();
};
exports.forfeitGame = forfeitGame;

const movePiece = async (direction, socket) => {
    const game = (0, utils.getTetrisGame)(socket.id);
    // TODO: Add error.
    switch (direction) {
        case "left":
        case "right":
            game?.move(direction);
            return;
        default:
            return; //TODO: Add error.
    }
};
exports.movePiece = movePiece;

const rotatePiece = async (direction, socket) => {
    const game = (0, utils.getTetrisGame)(socket.id);
    // TODO: Add error.
    switch (direction) {
        case "clockwise":
        case "counter-clockwise":
        case "180":
            return game?.rotate(direction);
        default:
            return; //TODO: Add error.
    }
};
exports.rotatePiece = rotatePiece;

const dropPiece = async (dropType, socket) => {
    const game = (0, utils.getTetrisGame)(socket.id);
    // TODO: Add error.
    switch (dropType) {
        case "hard":
        case "soft":
        case "normal":
            game?.changeFallSpeed(dropType);
            return;
        default:
            return; //TODO: Add error.
    }
};
exports.dropPiece = dropPiece;

const holdPiece = async (socket) => {
    const game = (0, utils.getTetrisGame)(socket.id);
    //TODO: Add error.
    game?.swap();
};
exports.holdPiece = holdPiece;
