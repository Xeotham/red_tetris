import { FastifyRequest, FastifyReply } from "fastify";
import { deleteTetrisGame, getTetrisGame, getTetrisRoom, tetrisReq } from "../utils";
import { TetrisGame } from "../server/Game/TetrisGame";
import { MultiplayerRoom } from "../server/MultiplayerRoom";
import { Socket } from "socket.io";

export let   arcadeGamesLst: TetrisGame[] = [];
export let   multiplayerRoomLst: MultiplayerRoom[] = [];

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

export const tetrisArcade = async (socket: Socket) => {
	const tetrisGame = new TetrisGame(socket);
	console.log("Arcade Game started for", socket.id);
	arcadeGamesLst.push(tetrisGame);
	tetrisGame.gameLoop();
};

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

export const    retryGame = async (socket: Socket) => {

	let   game = getTetrisGame(socket.id);
	//TODO: Add error.

	game?.retry();
}

export const    forfeitGame = async (socket: Socket) => {

	const   game = getTetrisGame(socket.id);
	//TODO: Add error.

	game?.forfeit();
}

export const    movePiece = async (direction: string, socket: Socket) => {

	const   game = getTetrisGame(socket.id);
	// TODO: Add error.

	switch (direction) {
		case "left":
		case "right":
			game?.move(direction);
			return ;
		default:
			return ; //TODO: Add error.
	}
}

export const    rotatePiece = async (direction: string, socket: Socket) => {

	const   game = getTetrisGame(socket.id);
	// TODO: Add error.

	switch (direction) {
		case "clockwise":
		case "counter-clockwise":
		case "180":
			return game?.rotate(direction);
		default:
			return ; //TODO: Add error.
	}
}

export const    dropPiece = async (dropType: string, socket: Socket) => {

	const   game = getTetrisGame(socket.id);
	// TODO: Add error.

	switch (dropType) {
		case "hard":
		case "soft":
		case "normal":
			game?.changeFallSpeed(dropType);
			return ;
		default:
			return; //TODO: Add error.
	}
}

export const    holdPiece = async (socket: Socket) => {

	const   game = getTetrisGame(socket.id);
	//TODO: Add error.

	game?.swap();
}
