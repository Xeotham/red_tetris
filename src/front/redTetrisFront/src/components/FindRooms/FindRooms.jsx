import "./FindRooms.css";
import ReturnHomeButton from "../ReturnHomeButton/ReturnHomeButton.jsx";
import { useState, useRef, useEffect } from "react";
import { getRandomUsername } from "../../utils.jsx";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { address } from "../../main.jsx";


const   RoomList = () => {
	const   navigate = useNavigate();
	const [socket, setSocket] = useState(() => io(`http://${address}`));
	const [rooms, setRooms] = useState(() => []);
	const [page, setPage] = useState(() => 0);

	useEffect(() => {
		fetchRooms();
		// Clean up socket listeners on unmount
		return () => {
			socket.off("GET_MULTIPLAYER_ROOMS");
			socket.close();
		};
	}, [socket]);


	const fetchRooms = () => {
		socket.emit("getMultiplayerRooms");
		socket.once("GET_MULTIPLAYER_ROOMS", (rooms) => {
			setRooms(JSON.parse(rooms));
			setPage(0);
		});
	};

	const handlePageChange = (direction) => {
		if (direction === "refresh")
			fetchRooms();
		else if (direction === "next")
			if ((page + 1) * 10 < rooms.length)
				setPage(page + 1);
		else if (direction === "prev")
			if (page > 0)
				setPage(page - 1);
	};

	const roomElements = [];
	for (let i = 0; page * 10 + i < rooms.length && i < 10; i++) {
		roomElements.push(
			<div className={"room"} key={rooms[page * 10 + i].code || i} onClick={() => {
				// socket.close();
				navigate(`/${rooms[page * 10 + i].code}`)}
			}>
				<div className={"roomName"}>{`Room ${page * 10 + i + 1}`}</div>
				<div>{`code: ${rooms[page * 10 + i].code}`}</div>
				<div className={"roomPlayers"}>{`${rooms[page * 10 + i].nbPlayers} players`}</div>
			</div>
		);
		// TODO : Keep the +1 on the room?
	}

	return (
		<div>
			<div className={"button"} onClick={() => handlePageChange("refresh")}>Refresh</div>
			<div className={"nextPrevButtons"}>
				<div className={"button"} onClick={() => handlePageChange("prev")}>Prev</div>
				<div className={"button"} onClick={() => handlePageChange("next")}>Next</div>
			</div>
			<div className={"roomList"}>
				{roomElements}
			</div>
		</div>
	);
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