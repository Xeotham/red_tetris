import  './App.css'
import { Route, Routes } from "react-router-dom";
import ChoseUsername from "../ChoseUsername/ChoseUsername.jsx";
import Room from "../room/room.jsx";
import Home from "../Home/Home.jsx";
import FindRooms from "../FindRooms/FindRooms.jsx";
import Arcade from "../Arcade/Arcade.jsx";

const   App = () => {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={ <Home /> } />
				<Route path="/find-room" element={ <FindRooms/> }/>
				<Route path="/:roomId" element={ <ChoseUsername /> } />
				<Route path="/:roomId/:username" element={ <Room /> } />
				<Route path="/arcade-board" element={ <Arcade /> } />
			</Routes>
		</div>
	)
}

export default App;
