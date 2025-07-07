const assert = require('assert');
const chai = require('chai');
const { Pos } = require('./../tetris_app/server/Game/Pos.js');
const { Matrix } = require('./../tetris_app/server/Game/Matrix.js');
const { Mino } = require("../tetris_app/server/Game/Mino");

const expect = chai.expect;
const should = chai.should();

describe('Matrix', () => {
	it('Should create a Matrix with size (Pos)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		expect(matrix.size.getX()).to.equal(5);
		expect(matrix.size.getY()).to.equal(10);
		for (let y = 0; y < matrix.size.getY(); y++)
			expect(matrix.isRowEmpty()).to.be.true;
	});

	it('Should create a Matrix with another Matrix', () => {
		const matrix1 = new Matrix(new Pos(5, 10));
		matrix1.setAt(0, 0, new Mino("S"));
		const matrix2 = new Matrix(matrix1);
		expect(matrix1.getSize()).to.equal(matrix2.getSize());
		expect(matrix2.at(0, 0).getTexture()).to.equal("S");
		for (let y = 0; y < matrix2.size.getY(); y++)
			expect(matrix2.isRowEmpty()).to.be.true;
	});

	it('Deep copy should not share reference', () => {
		const matrix1 = new Matrix(new Pos(5, 10));
		matrix1.setAt(0, 0, new Mino("S"));
		const matrix2 = new Matrix(matrix1);
		matrix1.setAt(1, 1, new Mino("Z"));
		expect(matrix2.at(0, 0).getTexture()).to.equal("S");
		expect(matrix2.at(1, 1).getTexture()).to.not.equal("Z");
		for (let y = 0; y < matrix2.size.getY(); y++)
			expect(matrix2.isRowEmpty()).to.be.true;
	});

	it('Should return a Mino at a position', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S");
		expect(matrix.at(-1, -1)).to.equal(Matrix.full);
		expect(matrix.at(5, 0)).to.equal(Matrix.full);
		expect(matrix.at(0, 10)).to.equal(Matrix.full);
		matrix.setAt(3, 3, mino);
		for (let y = 0; y < matrix.size.getY(); y++) {
			for (let x = 0; x < matrix.size.getX(); x++) {
				if (x === 3 && y === 3)
					expect(matrix.at(x, y)).to.equal(mino);
				else
					expect(matrix.at(x, y)).to.not.be.equal(mino);
			}
		}
	});

	it('Should return a Mino at a position (Pos)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S");
		expect(matrix.at(new Pos(-1, -1))).to.equal(Matrix.full);
		expect(matrix.at(new Pos(5, 0))).to.equal(Matrix.full);
		expect(matrix.at(new Pos(0, 10))).to.equal(Matrix.full);
		matrix.setAt(3, 3, mino);
		for (let y = 0; y < matrix.size.getY(); y++) {
			for (let x = 0; x < matrix.size.getX(); x++) {
				if (x === 3 && y === 3)
					expect(matrix.at(new Pos(x, y))).to.equal(mino);
				else
					expect(matrix.at(new Pos(x, y))).to.not.be.equal(mino);
			}
		}
	});

	it('Should set a Mino at a position', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S");
		const oldMino = matrix.at(3, 3);
		expect(matrix.at(3, 3)).to.equal(oldMino);
		matrix.setAt(3, 3, mino);
		expect(matrix.at(3, 3)).to.equal(mino);
		expect(matrix.at(3, 3)).to.not.be.equal(oldMino);
		matrix.setAt(-1, -1, mino);
		expect(matrix.at(0, 0)).to.not.be.equal(mino);
		matrix.setAt(100, 100, mino);
		expect(matrix.at(100, 100, mino)).to.not.be.equal(mino);
	});

	it('Should set a Mino at a position (Pos)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S");
		const oldMino = matrix.at(3, 3);
		expect(matrix.at(3, 3)).to.equal(oldMino);
		matrix.setAt(new Pos(3, 3), mino);
		expect(matrix.at(3, 3)).to.equal(mino);
		expect(matrix.at(3, 3)).to.not.be.equal(oldMino);
		matrix.setAt(new Pos(-1, -1), mino);
		expect(matrix.at(0, 0)).to.not.be.equal(mino);
		matrix.setAt(new Pos(100, 100), mino);
		expect(matrix.at(100, 100, mino)).to.not.be.equal(mino);
	});

	it('Should return true if a solid Mino is at a position', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino1 = new Mino("S", true);
		const mino2 = new Mino("S", false);
		expect(matrix.isMinoAt(-1, -1)).to.be.true;
		expect(matrix.isMinoAt(5, 0)).to.be.true;
		expect(matrix.isMinoAt(0, 10)).to.be.true;
		matrix.setAt(2, 2, mino1);
		matrix.setAt(3, 3, mino2);
		expect(matrix.isMinoAt(0, 0)).to.be.false;
		expect(matrix.isMinoAt(2, 2)).to.be.true;
		expect(matrix.isMinoAt(3, 3)).to.be.false;
		matrix.setAt(2, 2, new Mino("EMPTY", true));
		expect(matrix.isMinoAt(0, 0)).to.be.false;
		expect(matrix.isMinoAt(2, 2)).to.be.false;
		expect(matrix.isMinoAt(3, 3)).to.be.false;
		matrix.setAt(2, 2, new Mino("EMPTY", false));
		expect(matrix.isMinoAt(0, 0)).to.be.false;
		expect(matrix.isMinoAt(2, 2)).to.be.false;
		expect(matrix.isMinoAt(3, 3)).to.be.false;
	});

	it('Should return true if a solid Mino is at a position (Pos)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino1 = new Mino("S", true);
		const mino2 = new Mino("S", false);
		expect(matrix.isMinoAt(new Pos(-1, -1))).to.be.true;
		expect(matrix.isMinoAt(new Pos(5, 0))).to.be.true;
		expect(matrix.isMinoAt(new Pos(0, 10))).to.be.true;
		matrix.setAt(2, 2, mino1);
		matrix.setAt(3, 3, mino2);
		expect(matrix.isMinoAt(new Pos(0, 0))).to.be.false;
		expect(matrix.isMinoAt(new Pos(2, 2))).to.be.true;
		expect(matrix.isMinoAt(new Pos(3, 3))).to.be.false;
		matrix.setAt(new Pos(2, 2), new Mino("EMPTY", true));
		expect(matrix.isMinoAt(new Pos(0, 0))).to.be.false;
		expect(matrix.isMinoAt(new Pos(2, 2))).to.be.false;
		expect(matrix.isMinoAt(new Pos(3, 3))).to.be.false;
		matrix.setAt(new Pos(2, 2), new Mino("EMPTY", false));
		expect(matrix.isMinoAt(new Pos(0, 0))).to.be.false;
		expect(matrix.isMinoAt(new Pos(2, 2))).to.be.false;
		expect(matrix.isMinoAt(new Pos(3, 3))).to.be.false;
	});

	it('Should return the size of the Matrix', () => {
		const pos = new Pos(5, 10);
		const falsePos = new Pos(5, 10);
		const matrix = new Matrix(pos);
		expect(matrix.getSize().getX()).to.equal(5);
		expect(matrix.getSize().getY()).to.equal(10);
		expect(matrix.getSize()).to.equal(pos);
		expect(matrix.getSize()).to.not.be.equal(falsePos);
	});

	it('Should empty a Matrix and keep the Mino (No new)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S");
		const mino2 = new Mino("EMPTY");
		matrix.setAt(0, 0, mino);
		expect(matrix.at(0, 0).getTexture()).to.equal("S");
		matrix.reset();
		expect(matrix.isRowEmpty()).to.be.true;
		expect(matrix.at(0, 0)).to.be.equal(mino);
		expect(matrix.at(0, 0)).to.not.be.equal(mino2);
	});

	it('Should return if a row is full', () => {
		const matrix = new Matrix(new Pos(5, 10));
		for (let y = 0; y < matrix.size.getY(); y++)
			expect(matrix.isRowFull(y)).to.be.false;
		for (let x = 0; x < matrix.size.getX(); x++)
			matrix.setAt(x, 0, new Mino("S", true));
		expect(matrix.isRowFull(0)).to.be.true;
		for (let y = 1; y < matrix.size.getY(); y++)
			expect(matrix.isRowFull(y)).to.be.false;
		expect(matrix.isRowFull(-1)).to.be.true;
		expect(matrix.isRowFull(15)).to.be.true;
	});

	it('Should return if a row is empty', () => {
		const matrix = new Matrix(new Pos(5, 10));
		for (let y = 0; y < matrix.size.getY(); y++)
			expect(matrix.isRowEmpty(y)).to.be.true;
		matrix.setAt(0, 0, new Mino("S", true));
		expect(matrix.isRowEmpty(0)).to.be.false;
		for (let x = 0; x < matrix.size.getX(); x++)
			matrix.setAt(x, 0, new Mino("S", true));
		expect(matrix.isRowEmpty(0)).to.be.false;
		for (let y = 1; y < matrix.size.getY(); y++)
			expect(matrix.isRowEmpty(y)).to.be.true;
		expect(matrix.isRowEmpty(-1)).to.be.true;
		expect(matrix.isRowEmpty(15)).to.be.true;
	});

	it('Should mark a row for removal', () => {
		const matrix = new Matrix(new Pos(5, 10));
		for (let y = 0; y < matrix.size.getY(); y++)
			for (let x = 0; x < matrix.size.getX(); x++)
				expect(matrix.at(x, y).getShouldRemove()).to.be.false;
		matrix.markRow(0);
		for (let x = 0; x < matrix.size.getX(); x++)
			expect(matrix.at(x, 0).getShouldRemove()).to.be.true;
		for (let y = 1; y < matrix.size.getY(); y++)
			for (let x = 0; x < matrix.size.getX(); x++)
				expect(matrix.at(x, y).getShouldRemove()).to.be.false;
		matrix.markRow(-1);
		matrix.markRow(15);
	});

	it('Should remove marked rows, shift above lines down and return how many lines were shifted', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = matrix.at(0, 0);
		const mino2 = matrix.at(0, 5);
		expect(matrix.shiftDown()).to.equal(0);
		expect(matrix.at(0, 0)).to.equal(mino);
		matrix.markRow(0);
		expect(matrix.shiftDown()).to.equal(1);
		expect(matrix.shiftDown()).to.equal(0);
		expect(matrix.at(0, 0)).to.not.be.equal(mino);
		expect(matrix.at(0, 5)).to.equal(mino2);
		matrix.markRow(9);
		expect(matrix.shiftDown()).to.equal(1);
		expect(matrix.at(0, 5)).to.not.be.equal(mino2);
		expect(matrix.at(0, 6)).to.equal(mino2);
	});

	it('Should shift up lines, add Garbage and tell if a Top Out Occured', () => {
		const matrix = new Matrix(new Pos(5, 10));
		const mino = new Mino("S", true);
		const mino2 = new Mino("S", true);
		matrix.setAt(0, 9, mino);
		matrix.setAt(0, 8, mino2);
		expect(matrix.addGarbage(2)).to.equal("");
		expect(matrix.at(0, 9)).to.not.be.equal(mino);
		expect(matrix.at(0, 8)).to.not.be.equal(mino2);
		expect(matrix.at(0, 7)).to.equal(mino);
		expect(matrix.at(0, 6)).to.equal(mino2);
		let garbageCount = 0;
		for (let x = 0; x < matrix.size.getX(); x++)
			for (let y = 8; y < matrix.size.getY(); y++)
				if (matrix.at(x, y).getTexture() === "GARBAGE")
					++garbageCount;
		expect(garbageCount).to.equal(8); // 2 lines of garbage, 5 columns, 1 hole
		matrix.setAt(0, 1, new Mino("O", true));
		expect(matrix.addGarbage(1)).to.equal("");
		expect(matrix.at(0, 0).getTexture()).to.equal("O");
		expect(matrix.addGarbage(1)).to.equal("Top Out");
		expect(matrix.addGarbage(-1)).to.equal("");
	});

	it('Should return if the Matrix is empty', () => {
		const matrix = new Matrix(new Pos(5, 10));
		expect(matrix.isEmpty()).to.be.true;
		matrix.setAt(0, 0, new Mino("S", true));
		expect(matrix.isEmpty()).to.be.false;
		matrix.reset();
		expect(matrix.isEmpty()).to.be.true;
	});

	it('Should have a full static Mino', () => {
		expect(Matrix.full.getTexture()).to.equal("Full");
		expect(Matrix.full.isSolid()).to.be.true;
		expect(Matrix.full.isEmpty()).to.be.false;
		expect(Matrix.full.getShouldRemove()).to.be.false;
		expect(Matrix.full.getIsShadow()).to.be.false;
	});
});
