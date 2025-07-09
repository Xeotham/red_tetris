"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.fastify = void 0;

const fastify = __importDefault(require("fastify"));
const cors = __importDefault(require("@fastify/cors"));
const socket_io = require("socket.io");
const dotenv = require("dotenv");
const routes = __importDefault(require("../tetris_app/socket/routes"));



(0, dotenv.config)();
exports.fastify = (0, fastify.default)();
exports.address = process.env.VITE_API_ADDRESS;

exports.io = new socket_io.Server(exports.fastify.server, {
    cors: {
        origin: '*', // Allow all origins, or specify your frontend's origin
        methods: ['GET', 'POST'],
    },
});

// Register the CORS plugin
// exports.fastify.register(cors.default, {
//     origin: `*`, // Allow all origins, or specify your frontend's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
// });

// Register routes
exports.fastify.register((fastify) => {
    fastify.get('/health', async (request, reply) => {
        // You can add more complex health checks here if needed
        return { status: 'ok' };
    });
});

// TODO env port
// if (require.main === module) {
    exports.fastify.listen({port: /*3000*/ parseInt(process.env.BACK_PORT), host: "0.0.0.0"}, (err, address) => {
        if (err) {
            exports.fastify.log.error(err);
            process.exit(1);
        }
        exports.io.on('connection', (socket) => {
            console.log(`${socket.id} connected!`);
            socket.on("message", (message) => {
                console.log(`Message from ${socket.id}: ${message}`);
            });
            (0, routes.default)(socket);
            // tetrisRoutes();
        });
        exports.io.on("arcadeStart", (socket) => {
            console.log(`${socket.id} arcade start`);
            // tetrisArcade(socket);
        });
        console.log(`🚀 Server listening at ${address}`);
    });
// }
// else {
//     console.log("Server module loaded, but not running. Use 'node server.js' to start the server.");
// }
