import  "./Arcade.css";
import ArcadeBoard from "../ArcadeBoard/ArcadeBoard.jsx";

const   arcade = () => {
	return (
		<div className={"board"}>
			{/*<div className={"title"}>ARCADE BOARD</div>*/}
			{/*<div className={"arcadeBoardContent"}>*/}
			{/*	<p>Welcome to the Arcade Board!</p>*/}
				<ArcadeBoard />
			{/*</div>*/}
		</div>
	);
}

export default arcade;