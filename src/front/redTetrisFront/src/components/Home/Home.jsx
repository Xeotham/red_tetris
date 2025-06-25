import  "./Home.css"
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import {useNavigate} from "react-router-dom";

const   Home = () => {
	const   navigate = useNavigate();

	const   arcadeOnClick = () => {
		console.log("arcadeOnClick");
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