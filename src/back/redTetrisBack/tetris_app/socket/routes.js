"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tetrisRoutes;

const controllers = require("./controllers");


async function tetrisRoutes(socket) {
    socket.on("arcadeStart", () => controllers.tetrisArcade(socket));
    socket.on("keydown", (key) => controllers.keyDown(key, socket));
    socket.on("keyup", (key) => controllers.keyUp(key, socket));
}
