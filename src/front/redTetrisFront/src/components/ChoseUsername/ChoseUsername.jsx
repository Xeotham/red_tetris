import "./ChoseUsername.css";
import {useNavigate, useParams} from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import {useEffect, useState} from "react";
import {getRandomUsername} from "../../utils.jsx";


const   InvalidRoomId = ({roomId}) => {
	const navigate = useNavigate();

	return (
		<>
			{roomId} is an invalid room ID. <br />
			Please use a valid room code. <br />
			Valid room codes are 4 uppercase letters (A-Z). <br />

			<div className={"invalidRoomButton"}>
				<TetrisButtons onClick={() => navigate("/")}>Return Home</TetrisButtons>
			</div>
		</>
	)
}

const ChoseUsername = () => {
	const   { roomId } = useParams();
	const   [inputValue, setInputValue] = useState(getRandomUsername(Math.random(), Math.random()));
	const   navigate = useNavigate();

	const handleUsernameChange = (inputUsername) => {
		// Allow alphanumeric and underscores, max 20 characters
		const   username = !(/^[A-Za-z0-9_]{1,20}$/.test(inputUsername)) ? getRandomUsername(Math.random(), Math.random()) : inputUsername;
		navigate(`/${roomId}/${username}`);
	};

	useEffect(() => {

	}, []);

	if ((/^[A-Z]+$/.test(roomId)) === false || roomId.length !== 4) {
		return (
			<>
				<InvalidRoomId roomId={roomId} />
			</>
		);
	}

	return (
		<>
			You are in room: {roomId}. <br />
			You can choose a username here. <br />

			<form onSubmit={(e) => {
				e.preventDefault();
				console.log(inputValue);
				localStorage.setItem("formSubmitted", "true");
				handleUsernameChange(inputValue);
			}} id={"chooseUsernameForm"}>
				<input
					className={"usernameInput"}
					type="text"
					placeholder={getRandomUsername(Math.random(), Math.random())}
					style={{ marginTop: "10px", padding: "8px", fontSize: "16px" }}
					onChange={e => setInputValue(e.target.value)}
					value={inputValue}
				/>
				<input className={"submitButton"} type="submit" value="Submit"/>
			</form>
		</>
	);
};

export default ChoseUsername;