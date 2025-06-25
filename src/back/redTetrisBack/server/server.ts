import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { Server } from "socket.io";
import { config } from "dotenv";
import tetrisRoutes from "../tetris_app/api/routes";

config();

export const fastify = Fastify();
export const io = new Server(fastify.server);

// Register the CORS plugin
fastify.register(fastifyCors, {
	origin: `*`, // Allow all origins, or specify your frontend's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
});

// Register routes
fastify.register(tetrisRoutes, { prefix: '/api/tetris' });
fastify.register((fastify)=>{
	fastify.get('/health', async (request, reply) => {
		// You can add more complex health checks here if needed
		return { status: 'ok' };
	});
})

// Start the server
fastify.listen({ port: parseInt(process.env.BACK_PORT!), host: "0.0.0.0" }, (err: Error | null, address: string) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	// io.listen(4000);
	// io.attach(3000);

	// io.addListener("connection", (socket) => {
	// 	socket.send(JSON.stringify({message: "Hello from the server!"}));
	// })

	io.on('connection', (socket) => {
		console.log(`Received ${JSON.stringify(socket.id)}`);
		socket.emit("message", { message: "Hello from the server!" });
	});

	console.log(`🚀 Server listening at ${address}`);
});
