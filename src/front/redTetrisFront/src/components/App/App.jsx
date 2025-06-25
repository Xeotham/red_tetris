import  './App.css'
import {BrowserRouter, Link, redirect, Route, Router, Routes, useNavigate} from "react-router-dom";
import ChoseUsername from "../ChoseUsername/ChoseUsername.jsx";
import JoinRoom from "../JoinRoom/JoinRoom.jsx";
import Home from "../Home/Home.jsx";
import {useEffect} from "react";
import FindRooms from "../FindRooms/FindRooms.jsx";
import ArcadeBoard from "../ArcadeBoard/ArcadeBoard.jsx";
import {io} from "socket.io-client";

const   App = () => {
	const   socket = new io('http://localhost:3000', {});

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={ <Home socket={socket}/> } />
				<Route path="/find-room" element={ <FindRooms/> }/>
				<Route path="/:roomId" element={ <ChoseUsername /> } />
				<Route path="/:roomId/:username" element={ <JoinRoom /> } />
				<Route path="/arcade-board" element={ <ArcadeBoard socket={socket}/> } />
			</Routes>
		</div>
	)
}

export default App
