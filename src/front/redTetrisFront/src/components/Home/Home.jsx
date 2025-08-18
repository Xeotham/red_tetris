import  "./Home.css"
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { address } from "../../main.jsx";

const   Home = () => {
	const   navigate = useNavigate();

	const   arcadeOnClick = () => {
		// console.log("arcadeOnClick");
		navigate("/arcade-board");
	}

	const   versusOnClick = () => {
		console.log("versusOnClick");
		// TODO : shoot
		// const socket = io(`http://${address}`);
		// socket.emit("joinMultiplayerVersus");
		// socket.on("JOIN_MULTIPLAYER_VERSUS", (roomCode) => {
		// 	navigate("/" + JSON.parse(roomCode));
		// 	socket.disconnect();
		// })
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