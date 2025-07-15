import chai from 'chai';
import chooseUsername from "../src/components/ChoseUsername/ChooseUsername.jsx";

const expect = chai.expect;

describe('Choose username', () => {

	it('Should allow the user to choose a username in a room', () => {
		const roomCode = 'TEST';
		const chooseUsernameComponent = chooseUsername({ roomCode });

		expect(chooseUsernameComponent).to.be.an('object');
		expect(chooseUsernameComponent.type).to.equal('div');
		expect(chooseUsernameComponent.props.children).to.include(`You are in room: ${roomCode}`);
		expect(chooseUsernameComponent.props.children).to.include('You can choose a username here.');
	});

});
