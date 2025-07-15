import { useParams } from "react-router-dom";

const   ChooseUsername = () => {

	const   { roomId } = useParams();

	return (
		<>
		You are in room: {roomId}. <br />
			You can choose a username here.
		</>
	)
}

export default ChooseUsername;