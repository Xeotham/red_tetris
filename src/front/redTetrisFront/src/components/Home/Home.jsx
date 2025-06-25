import  "./Home.css"
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import { data, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import  * as R from 'ramda';
import {sfxPlayer} from "../../sfxHandler.jsx";


const   Home = () => {
	const   navigate = useNavigate();

	const   socket = new io('http://localhost:3000', {});
	const   socketListeners = ev => listener => socket.on(ev, listener);
	socketListeners("EFFECT")((data) => {
		data = JSON.parse(data);
		console.log (data);
		return sfxPlayer(data.type, data.value).play()
	});
	const   socketGame = socketListeners("GAME");
	const   socketGameStart = socketListeners("GAME_START");



	const   arcadeOnClick = () => {
		console.log("arcadeOnClick");
		navigate("/arcade-board");
		// socket.emit("arcadeStart", {});
		// socketGame((data) => {
			// console.log(data);
		// })
	}

	const   versusOnClick = () => {
		console.log("versusOnClick");
	}

	const   joinGameOnClick = () => {
		console.log("joinGameOnClick");
		navigate("/find-room");
	}

	return (
		<div>
			<div className={"title"}>PURPLE TETRIS</div>
			<div className={"menu"}>
				<TetrisButtons id={"arcade"} onClick={arcadeOnClick}>
					PLAY ARCADE
				</TetrisButtons>
				<TetrisButtons id={"versus"} onClick={versusOnClick}>
					PLAY VERSUS
				</TetrisButtons>
				<TetrisButtons id={"joinGame"} onClick={joinGameOnClick}>
					JOIN A GAME
				</TetrisButtons>
			</div>
		</div>
	)
}

export default Home;