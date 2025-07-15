import chai from 'chai';
import { sfxPlayer } from './../src/sfxHandler.jsx';

const expect = chai.expect;

global.Audio = class {
	constructor(src) {
		this.src = src;
	}
};

describe('SfxHandler', () => {

	it('Should return the corresponding audio object for a given sound', () => {
		const oldConsoleError = console.error;

		let logOutput = '';
		console.error = (message) => {
			logOutput += message + '\n';
		};

		expect(sfxPlayer("BTB", 1)).to.be.an.instanceof(Audio);
		expect(sfxPlayer("BTB", 1).src).to.equal("/src/assets/sfx/BejeweledSR/btb_1.ogg");
		expect(sfxPlayer("BTB", 2).src).to.equal("/src/assets/sfx/BejeweledSR/btb_2.ogg");
		expect(sfxPlayer("BTB", 3).src).to.equal("/src/assets/sfx/BejeweledSR/btb_3.ogg");
		expect(sfxPlayer("BTB", "break").src).to.equal("/src/assets/sfx/BejeweledSR/btb_break.ogg");
		expect(sfxPlayer("BTB", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("CLEAR", "allclear").src).to.equal("/src/assets/sfx/BejeweledSR/allclear.ogg");
		expect(sfxPlayer("CLEAR", "btb").src).to.equal("/src/assets/sfx/BejeweledSR/clearbtb.ogg");
		expect(sfxPlayer("CLEAR", "line").src).to.equal("/src/assets/sfx/BejeweledSR/clearline.ogg");
		expect(sfxPlayer("CLEAR", "quad").src).to.equal("/src/assets/sfx/BejeweledSR/clearquad.ogg");
		expect(sfxPlayer("CLEAR", "spin").src).to.equal("/src/assets/sfx/BejeweledSR/clearspin.ogg");
		expect(sfxPlayer("CLEAR", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("COMBO", 1).src).to.equal("/src/assets/sfx/BejeweledSR/combo_1.ogg");
		expect(sfxPlayer("COMBO", 2).src).to.equal("/src/assets/sfx/BejeweledSR/combo_2.ogg");
		expect(sfxPlayer("COMBO", 3).src).to.equal("/src/assets/sfx/BejeweledSR/combo_3.ogg");
		expect(sfxPlayer("COMBO", 4).src).to.equal("/src/assets/sfx/BejeweledSR/combo_4.ogg");
		expect(sfxPlayer("COMBO", 5).src).to.equal("/src/assets/sfx/BejeweledSR/combo_5.ogg");
		expect(sfxPlayer("COMBO", 6).src).to.equal("/src/assets/sfx/BejeweledSR/combo_6.ogg");
		expect(sfxPlayer("COMBO", 7).src).to.equal("/src/assets/sfx/BejeweledSR/combo_7.ogg");
		expect(sfxPlayer("COMBO", 8).src).to.equal("/src/assets/sfx/BejeweledSR/combo_8.ogg");
		expect(sfxPlayer("COMBO", 9).src).to.equal("/src/assets/sfx/BejeweledSR/combo_9.ogg");
		expect(sfxPlayer("COMBO", 10).src).to.equal("/src/assets/sfx/BejeweledSR/combo_10.ogg");
		expect(sfxPlayer("COMBO", 11).src).to.equal("/src/assets/sfx/BejeweledSR/combo_11.ogg");
		expect(sfxPlayer("COMBO", 12).src).to.equal("/src/assets/sfx/BejeweledSR/combo_12.ogg");
		expect(sfxPlayer("COMBO", 13).src).to.equal("/src/assets/sfx/BejeweledSR/combo_13.ogg");
		expect(sfxPlayer("COMBO", 14).src).to.equal("/src/assets/sfx/BejeweledSR/combo_14.ogg");
		expect(sfxPlayer("COMBO", 15).src).to.equal("/src/assets/sfx/BejeweledSR/combo_15.ogg");
		expect(sfxPlayer("COMBO", 16).src).to.equal("/src/assets/sfx/BejeweledSR/combo_16.ogg");
		expect(sfxPlayer("COMBO", "break").src).to.equal("/src/assets/sfx/BejeweledSR/combobreak.ogg");
		expect(sfxPlayer("COMBO", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("GARBAGE", "counter").src).to.equal("/src/assets/sfx/BejeweledSR/counter.ogg");
		expect(sfxPlayer("GARBAGE", "damage_alert").src).to.equal("/src/assets/sfx/BejeweledSR/damage_alert.ogg");
		expect(sfxPlayer("GARBAGE", "damage_large").src).to.equal("/src/assets/sfx/BejeweledSR/damage_large.ogg");
		expect(sfxPlayer("GARBAGE", "damage_medium").src).to.equal("/src/assets/sfx/BejeweledSR/damage_medium.ogg");
		expect(sfxPlayer("GARBAGE", "damage_small").src).to.equal("/src/assets/sfx/BejeweledSR/damage_small.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_in_large").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_in_large.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_in_medium").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_in_medium.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_in_small").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_in_small.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_out_large").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_out_large.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_out_medium").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_out_medium.ogg");
		expect(sfxPlayer("GARBAGE", "garbage_out_small").src).to.equal("/src/assets/sfx/BejeweledSR/garbage_out_small.ogg");
		expect(sfxPlayer("GARBAGE", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("USER_EFFECT", "harddrop").src).to.equal("/src/assets/sfx/BejeweledSR/harddrop.ogg");
		expect(sfxPlayer("USER_EFFECT", "softdrop").src).to.equal("/src/assets/sfx/BejeweledSR/softdrop.ogg");
		expect(sfxPlayer("USER_EFFECT", "hold").src).to.equal("/src/assets/sfx/BejeweledSR/hold.ogg");
		expect(sfxPlayer("USER_EFFECT", "move").src).to.equal("/src/assets/sfx/BejeweledSR/move.ogg");
		expect(sfxPlayer("USER_EFFECT", "rotate").src).to.equal("/src/assets/sfx/BejeweledSR/rotate.ogg");
		expect(sfxPlayer("USER_EFFECT", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("LEVEL", 1).src).to.equal("/src/assets/sfx/BejeweledSR/level1.ogg");
		expect(sfxPlayer("LEVEL", 5).src).to.equal("/src/assets/sfx/BejeweledSR/level5.ogg");
		expect(sfxPlayer("LEVEL", 10).src).to.equal("/src/assets/sfx/BejeweledSR/level10.ogg");
		expect(sfxPlayer("LEVEL", 15).src).to.equal("/src/assets/sfx/BejeweledSR/level15.ogg");
		expect(sfxPlayer("LEVEL", "up").src).to.equal("/src/assets/sfx/BejeweledSR/levelup.ogg");
		expect(sfxPlayer("LEVEL", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("LOCK", "spinend").src).to.equal("/src/assets/sfx/BejeweledSR/spinend.ogg");
		expect(sfxPlayer("LOCK", "lock").src).to.equal("/src/assets/sfx/BejeweledSR/lock.ogg");
		expect(sfxPlayer("LOCK", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("SPIN", "don't care").src).to.equal("/src/assets/sfx/BejeweledSR/spin.ogg");

		expect(sfxPlayer("BOARD", "floor").src).to.equal("/src/assets/sfx/BejeweledSR/floor.ogg");
		expect(sfxPlayer("BOARD", "sidehit").src).to.equal("/src/assets/sfx/BejeweledSR/sidehit.ogg");
		expect(sfxPlayer("BOARD", "topout").src).to.equal("/src/assets/sfx/BejeweledSR/topout.ogg");
		expect(sfxPlayer("BOARD", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown sound unknown");
		logOutput = '';

		expect(sfxPlayer("UNKNOWN", "unknown")).to.equal(undefined);
		expect(logOutput).to.include("Unknown type UNKNOWN");
		logOutput = '';

		console.error = oldConsoleError;
	});

});
