import  "./ArcadeBoard.css"
import Matrix from "../Matrix/Matrix.jsx";
import {useEffect, useState} from "react";
import {Socket} from "socket.io";

const   arcadeBoard = () => {
	const   socket = new Socket('http://localhost:3000', {});
	const   [matrix, setMatrix] = useState();


	useEffect(() => {
		socket.emit("arcadeStart", {});

		socket.on("GAME_START" , (data) => {
			data = JSON.parse(data);

			setMatrix(data.matrix);
		})

		socket.on("GAME", (data) => {
			data = JSON.parse(data);

			setMatrix(data.matrix);
		})
		// return () => {
		// 	socket.off("GAME");
		// 	socket.off("MATRIX");
		// };
	})

	return (
		<div className={"arcadeBoard"}>
			<div className={"title"}>ARCADE BOARD</div>
			<div className={"arcadeBoardContent"}>
				<p>Welcome to the Arcade Board!</p>
				<p>Here you can play against the computer or practice your skills.</p>
				<Matrix matrix={matrix} />
			</div>
		</div>
	);
}

export default arcadeBoard;