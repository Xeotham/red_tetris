const assert = require('assert');
const chai = require('chai');
const { clamp, mod, delay } = require('./../tetris_app/server/Game/utils.js');

const expect = chai.expect;
const should = chai.should();

describe('Tetris Utils', () => {

	it('Should return the modulo of a number', () => {
		expect(mod(5, 3)).to.equal(2);
		expect(mod(-1, 3)).to.equal(2);
		expect(mod(4, 3)).to.equal(1);
		expect(mod(-4, 3)).to.equal(2);
		expect(mod(0, 3)).to.equal(0);
	});

	it('Should clamp a value between min and max', () => {
		expect(clamp(5, 1, 10)).to.equal(5);
		expect(clamp(0, 1, 10)).to.equal(1);
		expect(clamp(15, 1, 10)).to.equal(10);
		expect(clamp(-5, -10, -1)).to.equal(-5);
		expect(clamp(-15, -10, -1)).to.equal(-10);
	});

	it('Should await for a delay specified in the argument', async () => {
		let start = Date.now();
		await delay(20);
		let end = Date.now();
		expect(end - start).to.be.at.least(19);
		expect(end - start).to.be.below(40);
		start = Date.now();
		await delay(25);
		end = Date.now();
		expect(end - start).to.be.at.least(24);
		expect(end - start).to.be.below(50);
	});
});
