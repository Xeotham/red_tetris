"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.isUpperCase = exports.codeNameExists = exports.getTetrisRoom = exports.deleteTetrisGame = exports.getTetrisGame = void 0;
exports.idGenerator = idGenerator;

const controllers = require("./socket/controllers");

const getTetrisGame = (gameId) => {
    if (controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId))
        return controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId);
    return controllers.multiplayerRoomLst.find((room => room.getGameById(gameId)))?.getGameById(gameId);
};

exports.getTetrisGame = getTetrisGame;
const deleteTetrisGame = (gameId) => {
    (0, exports.getTetrisGame)(gameId)?.setOver(true);
    if (controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId))
        controllers.arcadeGamesLst.splice(controllers.arcadeGamesLst.indexOf(controllers.arcadeGamesLst.find((game) => game.getGameId() === gameId)), 1);
};
exports.deleteTetrisGame = deleteTetrisGame;

const getTetrisRoom = (roomCode) => {
    if (!roomCode)
        return undefined;
    return controllers.multiplayerRoomLst.find((room) => room.getCode() === roomCode);
};
exports.getTetrisRoom = getTetrisRoom;

const codeNameExists = (code) => {
    return controllers.multiplayerRoomLst.find((room) => { return room.getCode() === code; });
};
exports.codeNameExists = codeNameExists;

const isUpperCase = (str) => {
    return /^[A-Z]+$/.test(str);
};
exports.isUpperCase = isUpperCase;

function* idGenerator() {
    let id = 0;
    while (true) {
        yield id++;
    }
    return id;
}
