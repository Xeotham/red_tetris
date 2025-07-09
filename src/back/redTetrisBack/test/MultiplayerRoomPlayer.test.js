const assert = require('assert');
const chai = require('chai');
const { MultiplayerRoomPlayer } = require('./../tetris_app/server/MultiplayerRoomPlayer.js');
const { io, Socket } = require("socket.io-client");
const { address } = require("../server/server");
	
const expect = chai.expect;
const should = chai.should();

describe('MultiplayerRoomPlayer', () => {

	it('Should create a MultiplayerRoomPlayer with a socket', () => {
		const socket = io(`http://${address}`);
		console.log("Socket ID:", socket.id);
		socket.close();
	});

});
