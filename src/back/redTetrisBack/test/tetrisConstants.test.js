const assert = require('assert');
const chai = require('chai');
const tc = require('./../tetris_app/server/Game/tetrisConstants.js');

const expect = chai.expect;
const should = chai.should();

describe('Tetris Constants', () => {
	it('The Fall Speed should be calculated correctly according to the official Tetris guideline', () => {
		expect(tc.FALL_SPEED(1)).to.equal(1000);
		expect(tc.FALL_SPEED(2)).to.equal(793);
		expect(tc.FALL_SPEED(3)).to.equal(618);
		expect(tc.FALL_SPEED(4)).to.equal(473);
		expect(tc.FALL_SPEED(5)).to.equal(355);
		expect(tc.FALL_SPEED(6)).to.equal(262);
		expect(tc.FALL_SPEED(7)).to.equal(190);
		expect(tc.FALL_SPEED(8)).to.equal(135);
		expect(tc.FALL_SPEED(9)).to.equal(94);
		expect(tc.FALL_SPEED(10)).to.equal(64);
		expect(tc.FALL_SPEED(11)).to.equal(43);
		expect(tc.FALL_SPEED(12)).to.equal(28);
		expect(tc.FALL_SPEED(13)).to.equal(18);
		expect(tc.FALL_SPEED(14)).to.equal(11);
		expect(tc.FALL_SPEED(15)).to.equal(7);
	});

	it('Soft Drop Speed should be calculated correctly according to the official Tetris guideline', () => {
		expect(tc.SOFT_DROP_SPEED(1)).to.equal(50);
		expect(tc.SOFT_DROP_SPEED(2)).to.equal(40);
		expect(tc.SOFT_DROP_SPEED(3)).to.equal(31);
		expect(tc.SOFT_DROP_SPEED(4)).to.equal(24);
		expect(tc.SOFT_DROP_SPEED(5)).to.equal(18);
		expect(tc.SOFT_DROP_SPEED(6)).to.equal(13);
		expect(tc.SOFT_DROP_SPEED(7)).to.equal(10);
		expect(tc.SOFT_DROP_SPEED(8)).to.equal(7);
		expect(tc.SOFT_DROP_SPEED(9)).to.equal(5);
		expect(tc.SOFT_DROP_SPEED(10)).to.equal(3);
		expect(tc.SOFT_DROP_SPEED(11)).to.equal(2);
		expect(tc.SOFT_DROP_SPEED(12)).to.equal(1);
		expect(tc.SOFT_DROP_SPEED(13)).to.equal(1);
		expect(tc.SOFT_DROP_SPEED(14)).to.equal(1);
		expect(tc.SOFT_DROP_SPEED(15)).to.equal(1);
	});

	it('Hard Drop Speed should be set to 0.1', () => {
		expect(tc.HARD_DROP_SPEED).to.equal(0.1);
	});

	it('The scoring system should be calculated correctly according to the official Tetris guideline', () => {
		expect(tc.SCORE_CALCULUS("", 1, false)).to.equal(0);
		expect(tc.SCORE_CALCULUS("aaaaaaaaaaaaaaaaa", 1, false)).to.equal(0);

		expect(tc.SCORE_CALCULUS("Zero", 1, false)).to.equal(0);
		expect(tc.SCORE_CALCULUS("normal Drop", 1, false)).to.equal(0);
		expect(tc.SCORE_CALCULUS("soft Drop", 1, false)).to.equal(1);
		expect(tc.SCORE_CALCULUS("hard Drop", 1, false)).to.equal(2);
		expect(tc.SCORE_CALCULUS("Single", 1, false)).to.equal(100);
		expect(tc.SCORE_CALCULUS("Double", 1, false)).to.equal(300);
		expect(tc.SCORE_CALCULUS("Triple", 1, false)).to.equal(500);
		expect(tc.SCORE_CALCULUS("Quad", 1, false)).to.equal(800);
		expect(tc.SCORE_CALCULUS("Mini S-Spin Zero", 1, false)).to.equal(100);
		expect(tc.SCORE_CALCULUS("Mini L-Spin Single", 1, false)).to.equal(200);

		expect(tc.SCORE_CALCULUS("soft Drop", 2, false)).to.equal(1);
		expect(tc.SCORE_CALCULUS("hard Drop", 2, false)).to.equal(2);
		expect(tc.SCORE_CALCULUS("Single", 2, false)).to.equal(200);
		expect(tc.SCORE_CALCULUS("Double", 2, false)).to.equal(600);
		expect(tc.SCORE_CALCULUS("Triple", 2, false)).to.equal(1000);
		expect(tc.SCORE_CALCULUS("Quad", 2, false)).to.equal(1600);
		expect(tc.SCORE_CALCULUS("Mini S-Spin Zero", 2, false)).to.equal(200);
		expect(tc.SCORE_CALCULUS("Mini L-Spin Single", 2, false)).to.equal(400);

		expect(tc.SCORE_CALCULUS("soft Drop", 15, false)).to.equal(1);
		expect(tc.SCORE_CALCULUS("hard Drop", 15, false)).to.equal(2);
		expect(tc.SCORE_CALCULUS("Single", 15, false)).to.equal(1500);
		expect(tc.SCORE_CALCULUS("Double", 15, false)).to.equal(4500);
		expect(tc.SCORE_CALCULUS("Triple", 15, false)).to.equal(7500);
		expect(tc.SCORE_CALCULUS("Quad", 15, false)).to.equal(12000);
		expect(tc.SCORE_CALCULUS("Mini S-Spin Zero", 15, false)).to.equal(1500);
		expect(tc.SCORE_CALCULUS("Mini L-Spin Single", 15, false)).to.equal(3000);

		expect(tc.SCORE_CALCULUS("soft Drop", 15, true)).to.equal(1);
		expect(tc.SCORE_CALCULUS("hard Drop", 15, true)).to.equal(2);
		expect(tc.SCORE_CALCULUS("Single", 15, true)).to.equal(2250);
		expect(tc.SCORE_CALCULUS("Double", 15, true)).to.equal(6750);
		expect(tc.SCORE_CALCULUS("Triple", 15, true)).to.equal(11250);
		expect(tc.SCORE_CALCULUS("Quad", 15, true)).to.equal(18000);
		expect(tc.SCORE_CALCULUS("Mini S-Spin Zero", 15, true)).to.equal(2250);
		expect(tc.SCORE_CALCULUS("Mini L-Spin Single", 15, true)).to.equal(4500);
	});

	it('The standard combo scoring should be as according to the official Tetris guideline', () => {
		tc.STANDARD_COMBO_SCORING(-10, 1).should.equal(0);
		tc.STANDARD_COMBO_SCORING(-1, 1).should.equal(0);
		tc.STANDARD_COMBO_SCORING(0, 1).should.equal(50);
		tc.STANDARD_COMBO_SCORING(0, 2).should.equal(100);
		tc.STANDARD_COMBO_SCORING(0, 6).should.equal(300);
		tc.STANDARD_COMBO_SCORING(9, 1).should.equal(500);
		tc.STANDARD_COMBO_SCORING(9, 10).should.equal(5000);
	});

	it('The B2B extra garbage sent by the opponent is as the Tetr.io guideline', () => {
		tc.B2B_EXTRA_GARBAGE(-10).should.equal(0);
		tc.B2B_EXTRA_GARBAGE(-1).should.equal(0);
		tc.B2B_EXTRA_GARBAGE(0).should.equal(0);
		tc.B2B_EXTRA_GARBAGE(1).should.equal(0);
		tc.B2B_EXTRA_GARBAGE(2).should.equal(1);
		tc.B2B_EXTRA_GARBAGE(5).should.equal(2);
		tc.B2B_EXTRA_GARBAGE(9).should.equal(3);
		tc.B2B_EXTRA_GARBAGE(25).should.equal(4);
		tc.B2B_EXTRA_GARBAGE(69).should.equal(5);
		tc.B2B_EXTRA_GARBAGE(186).should.equal(6);
		tc.B2B_EXTRA_GARBAGE(506).should.equal(7);
		tc.B2B_EXTRA_GARBAGE(1372).should.equal(8);
	});

	it('The garbage calculus should be as the Tetr.io guideline', () => {
		tc.GARBAGE_CALCULUS("aaaaaa", 0, false, tc.MULTIPLIER_COMBO_GARBAGE_TABLE).should.equal(0);
		tc.GARBAGE_CALCULUS("Zero", -1, false, tc.MULTIPLIER_COMBO_GARBAGE_TABLE).should.equal(0);
		tc.GARBAGE_CALCULUS("Zero", 10, true, tc.MULTIPLIER_COMBO_GARBAGE_TABLE).should.equal(0);
		tc.GARBAGE_CALCULUS("Single", 0, false, tc.MULTIPLIER_COMBO_GARBAGE_TABLE).should.equal(0);
	});
});