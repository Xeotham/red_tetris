import "./FindRooms.css";
import ReturnHomeButton from "../ReturnHomeButton/ReturnHomeButton.jsx";
import { useState, useRef, useEffect } from "react";
import {getRandomUsername} from "../../utils.jsx";
import {useNavigate} from "react-router-dom";


const   RoomList = () => {
	return (
		<div className={"roomList"}>
			<div className={"room"}>
				<div className={"roomName"}>Room 1</div>
				<div>code: TEST</div>
				<div className={"roomPlayers"}>2 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 2</div>
				<div>code: HEYY</div>
				<div className={"roomPlayers"}>1 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 3</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 4</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 5</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 6</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 7</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 8</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 9</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
			<div className={"room"}>
				<div className={"roomName"}>Room 10</div>
				<div>code: BRUH</div>
				<div className={"roomPlayers"}>3 players</div>
			</div>
		</div>
	)
}

const CreateRoom = ({ display, onClose }) => {
	const   createRoomRef = useRef();
	const   navigate = useNavigate();
	const   [usernameValue, setUsernameValue] = useState(getRandomUsername(Math.random(), Math.random()));
	const   [roomId, setRoomId] = useState("");
	const   [error, setError] = useState("");

	const handleUsernameChange = (inputUsername) => {
		// Allow alphanumeric and underscores, max 20 characters
		const   username = !(/^[A-Za-z0-9_]{1,20}$/.test(inputUsername)) ? getRandomUsername(Math.random(), Math.random()) : inputUsername;
		navigate(`/${roomId}/${username}`);
	};

	useEffect(() => {
        const handleClickOutside = (event) => {
			if (createRoomRef.current && !createRoomRef.current.contains(event.target)) {
				onClose();
				setUsernameValue(getRandomUsername(Math.random(), Math.random()));
			}
		};

        document.addEventListener("mousedown", handleClickOutside);
		return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
  }, [onClose]);

	return (
	<div className={"createRoom"} ref={createRoomRef} style={{ display: display ? "flex" : "none" }} >
		<div className={"title"} style={{ marginTop: "20px" }}>
	        Create Room
		</div>
		<form className={"createRoomForm"} onSubmit={(event) => {
			event.preventDefault();
			if (!(/^[A-Z]{4}$/.test(roomId))) {
				setError("Please enter a valid Room Code (4 uppercase letters).");
				return;
			}
			handleUsernameChange(usernameValue);
		}} >
			Enter the room code and your username to create a room.
			<span className={"createRoomError"} style={{ color: "red", display: error !== "" ? "block" : "none", margin: "10px" }}>
				{error}
			</span>
			<input className={"createRoomInput"} type="text" placeholder="Room Code" maxLength={4} minLength={4}
				onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
				onChange={e => setRoomId(e.target.value)}
			/>
			<input
				className={"createRoomInput"}
				type="text"
				style={{marginTop: "10px", padding: "8px", fontSize: "16px"}}
				onChange={e => setUsernameValue(e.target.value)}
				value={usernameValue}
			/>
			<input type={"submit"}/>
		</form>
	</div>
	);
};

const FindRooms = () => {
	const [showCreateRoom, setShowCreateRoom] = useState(false);

	return (
		<div className={"findRooms"}>
			<div className={"title"}>FIND ROOMS</div>
			<ReturnHomeButton/>
			<RoomList/>
			<CreateRoom display={showCreateRoom} onClose={() => setShowCreateRoom(false)} />
      <div
        className={"createRoomButton"}
        onClick={() => setShowCreateRoom(true)}
      >
        Create Room
      </div>
    </div>
  );
};

export default FindRooms;