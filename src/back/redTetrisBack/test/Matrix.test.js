const assert = require('assert');
const chai = require('chai');
const { Pos } = require('./../tetris_app/server/Game/Pos.js');
const { Matrix } = require('./../tetris_app/server/Game/Matrix.js');
const { Mino } = require("../tetris_app/server/Game/Mino");

const expect = chai.expect;
const should = chai.should();

describe('Matrix', () => {
	it('should create a Matrix with size (Pos)', () => {
		const matrix = new Matrix(new Pos(5, 10));
		expect(matrix.size.getX()).to.equal(5);
		expect(matrix.size.getY()).to.equal(10);
		for (let y = 0; y < matrix.size.getY(); y++)
			expect(matrix.isRowEmpty()).to.be.true;
	});

	it('should create a Matrix with another Matrix (Will be Empty)', () => {
		const matrix1 = new Matrix(new Pos(5, 10));
		matrix1.setAt(0, 0, new Mino("S"));
		const matrix2 = new Matrix(matrix1);
		for (let y = 0; y < matrix2.size.getY(); y++)
			expect(matrix2.isRowEmpty()).to.be.true;
	});

	it('Deep copy should not share reference and be empty', () => {
		const matrix1 = new Matrix(new Pos(5, 10));
		matrix1.setAt(0, 0, new Mino("S"));
		matrix1.setAt(1, 1, new Mino("Z"));
		const matrix2 = new Matrix(matrix1);
		expect(matrix2.at(0, 0).getType()).to.equal("EMPTY");
		expect(matrix2.at(1, 1).getType()).to.equal("EMPTY");
		for (let y = 0; y < matrix2.size.getY(); y++)
			expect(matrix2.isRowEmpty()).to.be.true;
	});

});
