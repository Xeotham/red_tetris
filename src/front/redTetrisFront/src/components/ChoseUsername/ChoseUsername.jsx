import {useParams} from "react-router-dom";

export default function ChoseUsername() {

	const   { roomId } = useParams();

	return (
		<>
		You are in room: {roomId}. <br />
			You can choose a username here.
		</>
	)
}