const assert = require('assert');
const chai = require('chai');
const { Pos } = require('./../tetris_app/server/Game/Pos.js');

const expect = chai.expect;
const should = chai.should();

describe('Pos', () => {
	it('Should create a Pos with x and y', () => {
		const pos = new Pos(5, 10);
		expect(pos.getX()).to.equal(5);
		expect(pos.getY()).to.equal(10);
	});

	it('Should create a Pos from another Pos', () => {
		const original = new Pos(3, 4);
		const pos = new Pos(original);
		expect(pos.getX()).to.equal(3);
		expect(pos.getY()).to.equal(4);
	});

	it('Deep copy should not share reference', () => {
		const original = new Pos(3, 4);
		const pos = new Pos(original);
		pos.setX(1);
		pos.setY(1);
		expect(original.getX()).to.equal(3);
		expect(original.getY()).to.equal(4);
		expect(pos.getX()).to.equal(1);
		expect(pos.getY()).to.equal(1);
	});

	it('Should add two positions (x, y)', () => {
		const pos1 = new Pos(2, 3);
		const result = pos1.add(4, 5);
		expect(result.getX()).to.equal(6);
		expect(result.getY()).to.equal(8);
		expect(pos1.getX()).to.equal(2);
		expect(pos1.getY()).to.equal(3);
	});

	it('Should add two positions (Pos)', () => {
		const pos1 = new Pos(2, 3);
		const pos2 = new Pos(4, 5);
		const result = pos1.add(pos2);
		expect(result.getX()).to.equal(6);
		expect(result.getY()).to.equal(8);
		expect(pos1.getX()).to.equal(2);
		expect(pos1.getY()).to.equal(3);
		expect(pos2.getX()).to.equal(4);
		expect(pos2.getY()).to.equal(5);
	});

	it('Should subtract two positions (x, y)', () => {
		const pos1 = new Pos(5, 7);
		const result = pos1.subtract(2, 3);
		expect(result.getX()).to.equal(3);
		expect(result.getY()).to.equal(4);
		expect(pos1.getX()).to.equal(5);
		expect(pos1.getY()).to.equal(7);
	});

	it('Should subtract two positions (Pos)', () => {
		const pos1 = new Pos(5, 7);
		const pos2 = new Pos(2, 3);
		const result = pos1.subtract(pos2);
		expect(result.getX()).to.equal(3);
		expect(result.getY()).to.equal(4);
		expect(pos1.getX()).to.equal(5);
		expect(pos1.getY()).to.equal(7);
		expect(pos2.getX()).to.equal(2);
		expect(pos2.getY()).to.equal(3);
	});

	it('Should calculate distance to another position', () => {
		const pos1 = new Pos(0, 0);
		const pos2 = new Pos(3, 4);
		expect(pos1.distanceTo(pos2)).to.equal(5); // 3-4-5 triangle
	});

	it('Should calculate distance to another position as a Pos', () => {
		const pos1 = new Pos(5, 5);
		const pos2 = new Pos(1, 1);
		const distancePos = pos1.distanceToPos(pos2);
		expect(distancePos.getX()).to.equal(4);
		expect(distancePos.getY()).to.equal(4);
		expect(pos1.getX()).to.equal(5);
		expect(pos1.getY()).to.equal(5);
		expect(pos2.getX()).to.equal(1);
		expect(pos2.getY()).to.equal(1);
	});

	it('Should move up, down, left, and right', () => {
		const pos = new Pos(5, 5);
		expect(pos.up().getY()).to.equal(4);
		expect(pos.getY()).to.equal(5);
		expect(pos.down().getY()).to.equal(6);
		expect(pos.getY()).to.equal(5);
		expect(pos.left().getX()).to.equal(4);
		expect(pos.getX()).to.equal(5);
		expect(pos.right().getX()).to.equal(6);
		expect(pos.getX()).to.equal(5);
	});

	it('Should clamp position within bounds', () => {
		const pos = new Pos(5, 5);
		const min = new Pos(0, 0);
		const max = new Pos(10, 10);
		const clampedPos = pos.clamp(min, max);
		expect(clampedPos.getX()).to.equal(5);
		expect(clampedPos.getY()).to.equal(5);

		const outOfBoundsPos = new Pos(-1, 15);
		const clampedOutOfBounds = outOfBoundsPos.clamp(min, max);
		expect(clampedOutOfBounds.getX()).to.equal(0);
		expect(clampedOutOfBounds.getY()).to.equal(10);
	});

	it('Should check equality of two positions', () => {
		const pos1 = new Pos(3, 4);
		const pos2 = new Pos(3, 4);
		const pos3 = new Pos(5, 6);
		expect(pos1.equals(pos2)).to.be.true;
		expect(pos1.equals(pos3)).to.be.false;
		expect(pos2.equals(pos3)).to.be.false;
		expect(pos1).to.not.be.equal(pos2);
	});

});

