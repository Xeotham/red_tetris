import {useParams} from "react-router-dom";

const   ChoseUsername = () => {

	const   { roomId } = useParams();

	return (
		<>
		You are in room: {roomId}. <br />
			You can choose a username here.
		</>
	)
}

export default ChoseUsername;