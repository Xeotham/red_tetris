import { useParams } from "react-router-dom";

const   JoinRoom = () => {
	const   { roomId, username } = useParams();
	return (
	<>
		You joined a room. <br />
		Room ID: {roomId}. <br />
		Username: {username}. <br />
	</>)
}

export default JoinRoom;