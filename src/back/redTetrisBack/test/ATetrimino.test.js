var __importDefault = (this && this.__importDefault) || function (mod) {
	return (mod && mod.__esModule) ? mod : { "default": mod };
};

const assert = require('assert');
const chai = require('chai');
const tc = require('./../tetris_app/server/Game/tetrisConstants.js');
const { ATetrimino } = require('./../tetris_app/server/Game/ATetrimino.js');
const { S } = require('./../tetris_app/server/Game/Pieces/S.js');
const { Z } = require('./../tetris_app/server/Game/Pieces/Z.js');
const { J } = require('./../tetris_app/server/Game/Pieces/J.js');
const { L } = require('./../tetris_app/server/Game/Pieces/L.js');
const { T } = require('./../tetris_app/server/Game/Pieces/T.js');
const { O } = require('./../tetris_app/server/Game/Pieces/O.js');
const { I } = require('./../tetris_app/server/Game/Pieces/I.js');
const SJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/SJson.json"));
const ZJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/ZJson.json"));
const JJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/JJson.json"));
const LJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/LJson.json"));
const TJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/TJson.json"));
const OJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/OJson.json"));
const IJson_json = __importDefault(require("./../tetris_app/server/Game/Pieces/IJson.json"));
const { Matrix } = require('./../tetris_app/server/Game/Matrix.js');
const { Pos } = require("../tetris_app/server/Game/Pos");
const { Mino } = require("../tetris_app/server/Game/Mino");

const expect = chai.expect;
const should = chai.should();

describe('ATetrimino', () => {

	it('Should not be able to instantiate as it is an abstract class', () => {
		expect(() => {
			new ATetrimino("S");
		}).to.throw(TypeError, "Cannot construct ATetrimino instances directly, use a subclass instead.");
		let piece;
		piece = new S("SRS");
		piece = new I("SRS");
		piece = new J("SRS");
		piece = new L("SRS");
		piece = new T("SRS");
		piece = new O("SRS");
		piece = new I("SRS");
	});

	it('All subclasses have unique attributes', () => {
		let piece;
		piece = new S("SRS");
		expect(piece.name).to.equal("S");
		expect(piece.texture).to.equal("S");
		expect(piece.rotation).to.equal(tc.NORTH);
		expect(piece.coordinates.getX()).to.equal(0);
		expect(piece.coordinates.getY()).to.equal(0);

		piece = new Z("SRS");
		expect(piece.name).to.equal("Z");
		expect(piece.texture).to.equal("Z");

		piece = new J("SRS");
		expect(piece.name).to.equal("J");
		expect(piece.texture).to.equal("J");

		piece = new L("SRS");
		expect(piece.name).to.equal("L");
		expect(piece.texture).to.equal("L");

		piece = new T("SRS");
		expect(piece.name).to.equal("T");
		expect(piece.texture).to.equal("T");

		piece = new O("SRS");
		expect(piece.name).to.equal("O");
		expect(piece.texture).to.equal("O");

		piece = new I("SRS");
		expect(piece.name).to.equal("I");
		expect(piece.texture).to.equal("I");
	});

	it('Should convert a JSON block to a pieceStruct', () => {
		const piece = new S("SRS");
		const struct = piece.getStruct();
		const nbBlocks = SJson_json.default.nbBlocks;
		expect(struct.size).to.equal(SJson_json.default.size);
		expect(struct.nbBlocks).to.equal(nbBlocks);
		expect(struct.north.blocks.length).to.equal(nbBlocks);
		expect(struct.east.blocks.length).to.equal(nbBlocks);
		expect(struct.south.blocks.length).to.equal(nbBlocks);
		expect(struct.west.blocks.length).to.equal(nbBlocks);
		expect(struct.north.blocks[0].getX()).to.equal(SJson_json.default.north.blocks[0].x);
		expect(struct.north.SRS[3].getY()).to.equal(SJson_json.default.north.SRS[3].y);
	});

	it('Should return the static struct of each subclass piece', () => {
		const sPiece = new S("SRS");
		expect(sPiece.getSize()).to.equal(SJson_json.default.size);
		expect(sPiece.getStruct().nbBlocks).to.equal(SJson_json.default.nbBlocks);

		const zPiece = new Z("SRS");
		expect(zPiece.getSize()).to.equal(Z.struct.size);
		expect(zPiece.getStruct().nbBlocks).to.equal(ZJson_json.default.nbBlocks);

		const jPiece = new J("SRS");
		expect(jPiece.getSize()).to.equal(J.struct.size);
		expect(jPiece.getStruct().nbBlocks).to.equal(JJson_json.default.nbBlocks);

		const lPiece = new L("SRS");
		expect(lPiece.getSize()).to.equal(L.struct.size);
		expect(lPiece.getStruct().nbBlocks).to.equal(LJson_json.default.nbBlocks);

		const tPiece = new T("SRS");
		expect(tPiece.getSize()).to.equal(T.struct.size);
		expect(tPiece.getStruct().nbBlocks).to.equal(TJson_json.default.nbBlocks);

		const oPiece = new O("SRS");
		expect(oPiece.getSize()).to.equal(O.struct.size);
		expect(oPiece.getStruct().nbBlocks).to.equal(OJson_json.default.nbBlocks);

		const iPiece = new I("SRS");
		expect(iPiece.getSize()).to.equal(I.struct.size);
		expect(iPiece.getStruct().nbBlocks).to.equal(IJson_json.default.nbBlocks);
	});

	it('Should return the spinCheck of each subclass piece', () => {
		let piece = new T("SRS");
		expect(piece.getSpinCheck().length).to.be.greaterThanOrEqual(2);
		piece = new Z("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
		piece = new S("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
		piece = new J("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
		piece = new L("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
		piece = new I("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
		piece = new O("SRS");
		expect(piece.getSpinCheck().length).to.not.be.greaterThanOrEqual(2);
	});

	it('Should place and remove the pieces on the matrix whether they are solid or not', () => {
		const matrix = new Matrix(new Pos(10, 20));
		let piece = new S("SRS", new Pos(5, 5));
		piece.place(matrix, true);
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(piece.coordinates.add(S.struct.north.blocks[i]))).to.be.true;
		piece.remove(matrix, false);
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(piece.coordinates.add(S.struct.north.blocks[i]))).to.be.false;
		piece.place(matrix, false, true); // Shadow
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(piece.coordinates.add(S.struct.north.blocks[i]))).to.be.false; // False because shadow is not solid
		piece.remove(matrix, true); // Shadow
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(piece.coordinates.add(S.struct.north.blocks[i]))).to.be.false;
		piece.setCoordinates(piece.coordinates.add(new Pos(-2, 2)));
		piece.place(matrix, true);
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(new Pos(3, 7).add(S.struct.north.blocks[i]))).to.be.true;
		piece.remove(matrix, false);
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.isMinoAt(new Pos(3, 7).add(S.struct.north.blocks[i]))).to.be.false;
	});

	it('Should rotate the piece in the matrix and return the spin type if any or -1 if no rotation', () => {
		const matrix = new Matrix(new Pos(10, 20));
		let piece = new S("SRS", new Pos(5, 5));
		piece.place(matrix, false);
		expect(piece.rotate("clockwise", matrix)).to.equal("");
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.at(piece.coordinates.add(S.struct.east.blocks[i])).isEmpty()).to.be.false;
		expect(piece.rotate("clockwise", matrix)).to.equal("");
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.at(piece.coordinates.add(S.struct.south.blocks[i])).isEmpty()).to.be.false;
		expect(piece.rotate("clockwise", matrix)).to.equal("");
		for (let i = 0; i < S.struct.nbBlocks; ++i)
			expect(matrix.at(piece.coordinates.add(S.struct.west.blocks[i])).isEmpty()).to.be.false;

		piece = new I("original", new Pos(1, 10));
		piece.setRotation(tc.EAST);
		matrix.reset();
		for (let y = 0; y < 20; ++y) {
			matrix.setAt(new Pos(4, y), new Mino("S", true));
			matrix.setAt(new Pos(6, y), new Mino("S", true));
		}
		piece.place(matrix, false);
		expect(piece.rotate("counter-clockwise", matrix)).to.equal("-1");
		expect(piece.rotate("clockwise", matrix)).to.equal("-1");
		expect(piece.rotate("180", matrix)).to.equal("-1");

		matrix.reset();
		piece = new T("SRS", new Pos(5, 15));
		for (let x = 1; x < 9; ++x)
			matrix.setAt(new Pos(x, 19), new Mino("S", true));
		piece.place(matrix, false);
		// matrix.print();
		expect(piece.rotate("counter-clockwise", matrix)).to.equal("Mini T-Spin");
		// matrix.print();
		piece.remove(matrix);
		piece.setRotation(tc.NORTH);
		piece.setCoordinates(piece.coordinates.add(new Pos(-8, 0)));
		piece.place(matrix, false);
		// matrix.print();
		expect(piece.rotate("clockwise", matrix)).to.equal("Mini T-Spin");
		// matrix.print();
		expect(piece.rotate("counter-clockwise", matrix)).to.equal("");
		// matrix.print();
		expect(piece.rotate("clockwise", matrix)).to.equal("Mini T-Spin");
		expect(piece.rotate("clockwise", matrix)).to.equal("");
		// matrix.print();
		for (let i = 0; i < piece.getStruct().nbBlocks; ++i)
			expect(matrix.at(piece.coordinates.add(piece.getStruct().south.blocks[i])).isEmpty()).to.be.false;

		matrix.reset();
		piece = new L("SRSX", new Pos(-2, 13));
		piece.setRotation(tc.WEST);
		for (let y = 15; y < 20; ++y)
			matrix.setAt(new Pos(0, y), new Mino("S", true));
		for (let y = 15; y < 19; ++y)
			matrix.setAt(new Pos(2, y), new Mino("S", true));
		matrix.setAt(new Pos(3, 19), new Mino("S", true));
		piece.place(matrix)
		expect(piece.rotate("180", matrix)).to.equal("Mini L-Spin");
		// matrix.print();
		for (let i = 17; i < 20; ++i)
			expect(matrix.at(new Pos(1, i)).isEmpty()).to.be.false;
		expect(matrix.at(new Pos(2, 19)).isEmpty()).to.be.false;
		piece.remove(matrix);
		piece.setRotation(tc.WEST);
		piece.setCoordinates(new Pos(-2, 12));
		piece.place(matrix)
		// matrix.print();
		expect(piece.rotate("180", matrix)).to.equal("");
		// matrix.print();
		for (let i = 12; i < 15; ++i)
			expect(matrix.at(new Pos(1, i)).isEmpty()).to.be.false;
		expect(matrix.at(new Pos(2, 14)).isEmpty()).to.be.false;

		matrix.reset();
		piece = new T("original", new Pos(-3, 5));
		piece.setRotation(tc.EAST);
		piece.place(matrix);
		expect(piece.rotate("counter-clockwise", matrix)).to.equal("-1");
		expect(piece.rotate("clockwise", matrix)).to.equal("-1");
		expect(piece.rotate("180", matrix)).to.equal("-1");
		expect(piece.getRotation()).to.equal(tc.EAST);
		// matrix.print();
		piece.remove(matrix);
		piece.setCoordinates(new Pos(0, 5));
		piece.setRotation(tc.EAST);
		piece.place(matrix);
		expect(piece.rotate("counter-clockwise", matrix)).to.equal("");
		expect(piece.rotate("clockwise", matrix)).to.equal("");
		expect(piece.rotate("180", matrix)).to.equal("");
		expect(piece.getRotation()).to.equal(tc.WEST);
		// matrix.print();
		piece.remove(matrix);
	});

	it('Should return if the piece is colliding with another piece in the matrix', () => {
		const matrix = new Matrix(new Pos(10, 20));
		let piece = new S("SRS", new Pos(5, 16));
		piece.place(matrix, false);
		// matrix.print();
		expect(piece.isColliding(matrix, new Pos(0, 0))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(1, 0))).to.be.true; // Colliding with the side
		expect(piece.isColliding(matrix, new Pos(-1, 0))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(0, -1))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(0, 1))).to.be.true; // Colliding with the side
		piece.remove(matrix);

		piece.setCoordinates(new Pos(1, 2));
		piece.place(matrix);
		matrix.setAt(new Pos(5, 5), new Mino("I", true));
		// matrix.print();
		expect(piece.isColliding(matrix, new Pos(0, 0))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(1, 0))).to.be.true;
		expect(piece.isColliding(matrix, new Pos(-1, 0))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(0, -1))).to.be.false;
		expect(piece.isColliding(matrix, new Pos(0, 1))).to.be.true;
		expect(piece.isColliding(matrix, new Pos(2, 0))).to.be.true;
		expect(piece.isColliding(matrix, new Pos(1, 1))).to.be.true;

		matrix.setAt(new Pos(3, 4), new Mino("I", true));
		piece.remove(matrix);
		expect(piece.isColliding(matrix, new Pos(0, 0))).to.be.false; // Works even if the piece is not placed
	});

	it('Should return if the piece can slide in the matrix', () => {
		const matrix = new Matrix(new Pos(10, 20));
		let piece = new S("SRS", new Pos(5, 16));
		piece.place(matrix, false);
		expect(piece.canSlide(matrix)).to.be.true;
		matrix.setAt(new Pos(6, 19), new Mino("I", true));
		// matrix.print();
		expect(piece.canSlide(matrix)).to.be.false;
		piece.remove(matrix);
		piece.setCoordinates(new Pos(2, 16));
		piece.place(matrix);
		// matrix.print();
		expect(piece.canSlide(matrix)).to.be.true;
		matrix.setAt(new Pos(4, 18), new Mino("I", true));
		// matrix.print();
		expect(piece.canSlide(matrix)).to.be.false;
	});

	it('Should return if the piece can fall in the matrix', () => {
		const matrix = new Matrix(new Pos(10, 20));
		let piece = new Z("SRS", new Pos(0, 5));
		piece.place(matrix, false);
		expect(piece.canFall(matrix)).to.be.true;
		// matrix.print();
		matrix.setAt(new Pos(2, 9), new Mino("I", true));
		expect(piece.canFall(matrix)).to.be.true;
		matrix.setAt(new Pos(3, 9), new Mino("I", true));
		// matrix.print();
		expect(piece.canFall(matrix)).to.be.false;
		piece.remove(matrix);
		piece.setCoordinates(piece.getCoordinates().up());
		piece.place(matrix, false);
		expect(piece.canFall(matrix)).to.be.true;
		matrix.setAt(new Pos(2, 7), new Mino("I", true));
		// matrix.print();
		expect(piece.canFall(matrix)).to.be.false;
	});

	it('Should get and set the coordinates of the piece', () => {
		const piece = new S("SRS", new Pos(5, 5));
		expect(piece.getCoordinates().getX()).to.equal(5);
		expect(piece.getCoordinates().getY()).to.equal(5);
		piece.setCoordinates(new Pos(10, 10));
		expect(piece.getCoordinates().getX()).to.equal(10);
		expect(piece.getCoordinates().getY()).to.equal(10);
		piece.setCoordinates(new Pos(-1, -1));
		expect(piece.getCoordinates().getX()).to.equal(-1);
		expect(piece.getCoordinates().getY()).to.equal(-1);
	});

	it('Should get and set the texture of the piece', () => {
		const piece = new S("SRS", new Pos(5, 5));
		expect(piece.getTexture()).to.equal("S");
		piece.setTexture("NewTexture");
		expect(piece.getTexture()).to.equal("NewTexture");
		piece.setTexture("S");
		expect(piece.getTexture()).to.equal("S");
	});

	it('Should get and set the name of the piece', () => {
		const piece = new S("SRS", new Pos(5, 5));
		expect(piece.getName()).to.equal("S");
		piece.setName("NewName");
		expect(piece.getName()).to.equal("NewName");
		piece.setName("S");
		expect(piece.getName()).to.equal("S");
	});

	it('Should get and set the rotation of the piece', () => {
		const piece = new S("SRS", new Pos(5, 5));
		expect(piece.getRotation()).to.equal(tc.NORTH);
		piece.setRotation(tc.EAST);
		expect(piece.getRotation()).to.equal(tc.EAST);
		piece.setRotation(tc.SOUTH);
		expect(piece.getRotation()).to.equal(tc.SOUTH);
		piece.setRotation(tc.WEST);
		expect(piece.getRotation()).to.equal(tc.WEST);
		piece.setRotation(tc.NORTH);
		expect(piece.getRotation()).to.equal(tc.NORTH);
	});
});
