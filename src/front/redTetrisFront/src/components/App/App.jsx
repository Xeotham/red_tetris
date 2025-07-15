import  './App.css'
import { Route, Routes } from "react-router-dom";
import ChooseUsername from "../ChoseUsername/ChooseUsername.jsx";
import JoinRoom from "../JoinRoom/JoinRoom.jsx";
import Home from "../Home/Home.jsx";
import FindRooms from "../FindRooms/FindRooms.jsx";
import Arcade from "../Arcade/Arcade.jsx";

const   App = () => {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={ <Home /> } />
				<Route path="/find-room" element={ <FindRooms/> }/>
				<Route path="/:roomId" element={ <ChooseUsername /> } />
				<Route path="/:roomId/:username" element={ <JoinRoom /> } />
				<Route path="/arcade-board" element={ <Arcade /> } />
			</Routes>
		</div>
	)
}

export default App;
