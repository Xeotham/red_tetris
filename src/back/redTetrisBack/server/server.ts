import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {DefaultEventsMap, Server, Socket} from "socket.io";
import { config } from "dotenv";
import tetrisRoutes from "../tetris_app/socket/routes";
import {tetrisArcade} from "../tetris_app/socket/controllers";

config();

export const fastify = Fastify();
export const io = new Server(fastify.server, {
	cors: {
		origin: '*', // Allow all origins, or specify your frontend's origin
		methods: ['GET', 'POST'],
	},
});

// Register the CORS plugin
fastify.register(fastifyCors, {
	origin: `*`, // Allow all origins, or specify your frontend's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
});

// Register routes
// fastify.register(tetrisRoutes, { prefix: '/socket/tetris' });
fastify.register((fastify)=>{
	fastify.get('/health', async (request, reply) => {
		// You can add more complex health checks here if needed
		return { status: 'ok' };
	});
})

fastify.listen({ port: parseInt(process.env.BACK_PORT!), host: "0.0.0.0" }, (err: Error | null, address: string) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	io.on('connection', (socket) => {
		console.log(`${socket.id} connected!`);
		socket.on("message", (message) => {console.log(`Message from ${socket.id}: ${message}`);});
		tetrisRoutes(socket);
		// tetrisRoutes();

	});

	io.on("arcadeStart", (socket) => {
		console.log(`${socket.id} arcade start`);
		// tetrisArcade(socket);
	})

	console.log(`🚀 Server listening at ${address}`);
});
