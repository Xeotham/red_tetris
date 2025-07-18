import { useParams } from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import { useState } from "react";

const ChooseUsername = () => {
	const getRandomUsername = () => {
		const adjectives = ["Quick", "Brave", "Clever", "Swift", "Bold"];
		const nouns = ["Fox", "Lion", "Eagle", "Tiger", "Wolf"];
		return adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)];
	};

	const { roomId } = useParams();
	const [username, setUsername] = useState(getRandomUsername());
	const [inputValue, setInputValue] = useState(username);

	if ((/^[A-Z]+$/.test(roomId)) === false || roomId.length !== 4) {
		return (
			<>
				Invalid room ID. <br />
				Please use a valid room code. <br />
				Valid room codes are 4 uppercase letters (A-Z). <br />
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10%", marginTop: "100%" }}>
					<TetrisButtons onClick={() => window.location.href = "/"}>Go to Home</TetrisButtons>
				</div>
			</>
		);
	}

	const handleUsernameChange = () => {
		// Allow alphanumeric and underscores, max 20 characters
		if (!(/^[A-Za-z0-9_]{1,20}$/.test(inputValue))) {
			const randomUsername = getRandomUsername();
			setUsername(randomUsername);
			setInputValue(randomUsername);
			console.log(randomUsername);
		} else {
			setUsername(inputValue);
			console.log(inputValue);
		}
	};

	return (
		<>
			You are in room: {roomId}. <br />
			You can choose a username here. <br />
			<input
				type="text"
				placeholder={getRandomUsername()}
				style={{ marginTop: "10px", padding: "8px", fontSize: "16px" }}
				onChange={e => setInputValue(e.target.value)}
				value={inputValue}
			/>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "-50%", height: "200%", width: "200%" }}>
				<TetrisButtons onClick={handleUsernameChange}>Submit</TetrisButtons>
			</div>
		</>
	);
};

export default ChooseUsername;