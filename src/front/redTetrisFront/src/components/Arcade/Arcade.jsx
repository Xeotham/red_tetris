import  "./Arcade.css";
import Board from "../ArcadeBoard/Board.jsx";

const   arcade = () => {
	return (
		<div className={"board"}>
			{/*<div className={"title"}>ARCADE BOARD</div>*/}
			{/*<div className={"arcadeBoardContent"}>*/}
			{/*	<p>Welcome to the Arcade Board!</p>*/}
				<Board />
			{/*</div>*/}
		</div>
	);
}

export default arcade;