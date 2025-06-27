import { FastifyInstance } from "fastify";
import {
	// dropPiece,
	// forfeitGame,
	// holdPiece,
	// tetrisMatchmaking,
	// tetrisCreateRoom,
	// tetrisJoinRoom,
	// tetrisRoomCommand,
	// tetrisQuitRoom,
	tetrisArcade,
	// movePiece,
	// rotatePiece,
	// getMultiplayerRooms,
	// retryGame,
} from "./controllers";
import { DefaultEventsMap, Socket } from "socket.io";

export default async function tetrisRoutes(socket:  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	socket.on("arcadeStart", () => {
		console.log(`${socket.id} arcade start`);
		tetrisArcade(socket)
	});

}
