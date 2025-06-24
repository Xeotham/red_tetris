import  './App.css'
import {BrowserRouter, Link, redirect, Route, Router, Routes, useNavigate} from "react-router-dom";
import ChoseUsername from "../ChoseUsername/ChoseUsername.jsx";
import JoinRoom from "../JoinRoom/JoinRoom.jsx";
import Home from "../Home/Home.jsx";
import {useEffect} from "react";
import FindRooms from "../FindRooms/FindRooms.jsx";

const   App = () => {

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={ <Home/> } />
				<Route path="/find-room" element={ <FindRooms/> }/>
				<Route path="/:roomId" element={ <ChoseUsername /> } />
				<Route path="/:roomId/:username" element={ <JoinRoom /> } />
			</Routes>
		</div>
	)
}

export default App
