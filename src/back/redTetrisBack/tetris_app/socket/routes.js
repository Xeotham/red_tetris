"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tetrisRoutes;

const controllers = require("./controllers");


async function tetrisRoutes(socket) {
    socket.on("arcadeStart", () => (0, controllers.tetrisArcade)(socket));
    socket.on("movePiece", (direction) => (0, controllers.movePiece)(direction, socket));
    socket.on("rotatePiece", (direction) => (0, controllers.rotatePiece)(direction, socket));
    socket.on("dropPiece", (dropType) => (0, controllers.dropPiece)(dropType, socket));
    socket.on("holdPiece", () => (0, controllers.holdPiece)(socket));
    socket.on("forfeitGame", () => (0, controllers.forfeitGame)(socket));
    socket.on("retryGame", () => (0, controllers.retryGame)(socket));
}
