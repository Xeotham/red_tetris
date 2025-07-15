import chai from 'chai';
import { getTexture } from './../src/utils.jsx';

const expect = chai.expect;

describe('Utils', () => {

	it('Should return the correct texture path for a given type', () => {
		expect(getTexture("I")).to.equal('/src/assets/textures/minimalist/I.png');
		expect(getTexture("J")).to.equal('/src/assets/textures/minimalist/J.png');
		expect(getTexture("L")).to.equal('/src/assets/textures/minimalist/L.png');
		expect(getTexture("O")).to.equal('/src/assets/textures/minimalist/O.png');
		expect(getTexture("S")).to.equal('/src/assets/textures/minimalist/S.png');
		expect(getTexture("T")).to.equal('/src/assets/textures/minimalist/T.png');
		expect(getTexture("Z")).to.equal('/src/assets/textures/minimalist/Z.png');
		expect(getTexture("EMPTY")).to.equal('/src/assets/textures/minimalist/empty.png');
		expect(getTexture("SHADOW")).to.equal('/src/assets/textures/minimalist/shadow.png');
		expect(getTexture("GARBAGE")).to.equal('/src/assets/textures/minimalist/garbage.png');
		expect(getTexture("MATRIX")).to.equal('/src/assets/textures/minimalist/matrix.png');
		expect(getTexture("HOLD")).to.equal('/src/assets/textures/minimalist/hold.png');
		expect(getTexture("BAGS")).to.equal('/src/assets/textures/minimalist/bags.png');
		expect(getTexture("UNKNOWN")).to.equal('/src/assets/textures/minimalist/empty.png');
	});

});

