import { FastifyInstance } from "fastify";
import {
	tetrisArcade,
	movePiece,
	rotatePiece,
	// tetrisMatchmaking,
	// tetrisCreateRoom,
	// tetrisJoinRoom,
	// tetrisRoomCommand,
	// tetrisQuitRoom,
	dropPiece,
	holdPiece,
	forfeitGame,
	// getMultiplayerRooms,
	retryGame,
} from "./controllers";
import { DefaultEventsMap, Socket } from "socket.io";

export default async function tetrisRoutes(socket:  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	socket.on("arcadeStart", () => tetrisArcade(socket));
	socket.on("movePiece", (direction: string) => movePiece(direction, socket));
	socket.on("rotatePiece", (direction: string) => rotatePiece(direction, socket));
	socket.on("dropPiece", (dropType: string) => dropPiece(dropType, socket));
	socket.on("holdPiece", () => holdPiece(socket));
	socket.on("forfeitGame", () => forfeitGame(socket));
	socket.on("retryGame", () => retryGame(socket));
}
