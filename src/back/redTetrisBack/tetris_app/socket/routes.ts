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
	socket.on("arcadeStart", () => tetrisArcade(socket));

	// fastify.get('/matchmaking', {websocket: true}, tetrisMatchmaking);
	// fastify.get('/arcade', {websocket: true}, tetrisArcade);
	// fastify.get('/createRoom', {websocket: true}, tetrisCreateRoom);
	// fastify.get('/getMultiplayerRooms', getMultiplayerRooms);
	// fastify.get('/joinRoom', {websocket: true}, tetrisJoinRoom);
	// fastify.post('/roomCommand', tetrisRoomCommand);
	// fastify.post('/quitRoom', tetrisQuitRoom);
	// fastify.post('/retry', retryGame);
	// fastify.post('/forfeit', forfeitGame);
	// fastify.post('/movePiece', movePiece);
	// fastify.post('/rotatePiece', rotatePiece);
	// fastify.post('/dropPiece', dropPiece);
	// fastify.post('/holdPiece', holdPiece);
}
