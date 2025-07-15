const assert = require('assert');
const chai = require('chai');
const { dlog } = require('../server/server');
const routes = require('../tetris_app/socket/routes').default;
const controllers = require('../tetris_app/socket/controllers');
const sinon = require('sinon');
const tetrisRoutes = require('../tetris_app/socket/routes').default;

const expect = chai.expect;
const should = chai.should();

describe('Server', () => {

	it('Should console log only if PRINT_LOGS is true', () => {
		const originalConsoleLog = console.log;
		let logOutput = '';
		console.log = (message) => {
			logOutput += message + '\n';
		};

		process.env.PRINT_LOGS = 'true';
		dlog('Test log message');
		expect(logOutput).to.include('Test log message');

		logOutput = '';
		process.env.PRINT_LOGS = 'false';
		dlog('This should not be logged');
		expect(logOutput).to.equal('');

		console.log = originalConsoleLog; // Restore original console.log
	});

});


describe('tetrisRoutes', () => {
	let socket;

	beforeEach(() => {
		socket = {
			on: sinon.stub(),
			emit: sinon.spy(),
		};
	});

	it('should register arcadeStart handler', () => {
		tetrisRoutes(socket);
		// Find the handler registered for "arcadeStart"
		const handler = socket.on.getCalls().find(call => call.args[0] === 'arcadeStart').args[1];
		sinon.stub(controllers, 'tetrisArcade');
		handler();
		sinon.assert.calledWith(controllers.tetrisArcade, socket);
		controllers.tetrisArcade.restore();
	});

	it('should register keydown handler', () => {
		tetrisRoutes(socket);
		const handler = socket.on.getCalls().find(call => call.args[0] === 'keydown').args[1];
		const key = 'ArrowUp';
		sinon.stub(controllers, 'keyDown');
		handler(key);
		sinon.assert.calledWith(controllers.keyDown, key, socket);
		controllers.keyDown.restore();
	});

	it('should register keyup handler', () => {
		tetrisRoutes(socket);
		const handler = socket.on.getCalls().find(call => call.args[0] === 'keyup').args[1];
		const key = 'ArrowDown';
		sinon.stub(controllers, 'keyUp');
		handler(key);
		sinon.assert.calledWith(controllers.keyUp, key, socket);
		controllers.keyUp.restore();
	});

	it('should register joinMultiplayerRoom handler', () => {
		tetrisRoutes(socket);
		const handler = socket.on.getCalls().find(call => call.args[0] === 'joinMultiplayerRoom').args[1];
		const roomCode = '12345';
		sinon.stub(controllers, 'joinMultiplayerRoom');
		handler(roomCode);
		sinon.assert.calledWith(controllers.joinMultiplayerRoom, socket, roomCode);
		controllers.joinMultiplayerRoom.restore();
	});

	it('should register quitMultiplayerRoom handler', () => {
		tetrisRoutes(socket);
		const handler = socket.on.getCalls().find(call => call.args[0] === 'quitMultiplayerRoom').args[1];
		const roomCode = '12345';
		sinon.stub(controllers, 'quitMultiplayerRoom');
		handler(roomCode);
		sinon.assert.calledWith(controllers.quitMultiplayerRoom, socket, roomCode);
		controllers.quitMultiplayerRoom.restore();
	});

});
