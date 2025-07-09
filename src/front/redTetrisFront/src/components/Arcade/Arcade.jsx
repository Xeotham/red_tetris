import  "./Arcade.css";
import Matrix from "../Matrix/Matrix.jsx";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { address } from "../../main.jsx";
import {sfxPlayer} from "../../sfxHandler.jsx";
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