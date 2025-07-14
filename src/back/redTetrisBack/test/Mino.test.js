const assert = require('assert');
const chai = require('chai');
const { Mino } = require('./../tetris_app/server/Game/Mino.js');

const expect = chai.expect;
const should = chai.should();

describe('Mino', () => {
	it('Should create a Mino with default texture and not solid state', () => {
		const mino = new Mino();
		expect(mino.getTexture()).to.equal("EMPTY");
		expect(mino.isSolid()).to.be.false;
	});

	it('Should create a Mino with specified type and solid state', () => {
		const mino = new Mino("S", true);
		expect(mino.getTexture()).to.equal("S");
		expect(mino.isSolid()).to.be.true;
	});

	it('Should reset the Mino to default state', () => {
		const mino = new Mino("BLUE", true);
		mino.reset();
		expect(mino.getTexture()).to.equal("EMPTY");
		expect(mino.isSolid()).to.be.false;
	});

	it('Should set and get texture correctly', () => {
		const mino = new Mino();
		mino.setTexture("GREEN");
		expect(mino.getTexture()).to.equal("GREEN");
		mino.setTexture("EMPTY");
		expect(mino.getTexture()).to.equal("EMPTY");
		expect(mino.isSolid()).to.be.false;
	});

	it('Should set and get solid state correctly', () => {
		const mino = new Mino();
		mino.setSolid(true);
		expect(mino.isSolid()).to.be.true;
	});

	it('Should set and get shadow state correctly', () => {
		const mino = new Mino();
		mino.setShadow(true);
		expect(mino.getIsShadow()).to.be.true;
	});

	it('Should set and get shouldRemove state correctly', () => {
		const mino = new Mino();
		mino.setShouldRemove(true);
		expect(mino.getShouldRemove()).to.be.true;
	});

	it('Should check if the Mino is empty', () => {
		const emptyMino = new Mino();
		const filledMino = new Mino("YELLOW", true);
		const mino3 = new Mino("EMPTY", true);
		expect(emptyMino.isEmpty()).to.be.true;
		expect(filledMino.isEmpty()).to.be.false;
		expect(mino3.isEmpty()).to.be.true;
	});
});
