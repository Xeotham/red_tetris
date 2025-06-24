import  "./FindRooms.css"
import ReturnHomeButton from "../ReturnHomeButton/ReturnHomeButton.jsx";

const   FindRooms = () => {
	return (
		<div className={"find-rooms"}>
			<div className={"title"}>FIND ROOMS</div>
			<ReturnHomeButton />
			<div className={"rooms-list"}>
				{/* List of rooms will be displayed here */}
			</div>
			<div className={"create-room-button"}>
				Create Room
			</div>
		</div>
	)
}

export default FindRooms