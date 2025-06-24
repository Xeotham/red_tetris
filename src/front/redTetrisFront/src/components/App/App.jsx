import  './App.css'
import {BrowserRouter, Link, redirect, Route, Router, Routes, useNavigate} from "react-router-dom";
import ChoseUsername from "../ChoseUsername/ChoseUsername.jsx";
import JoinRoom from "../JoinRoom/JoinRoom.jsx";
import Home from "../Home/Home.jsx";
import {useEffect} from "react";

function App() {

	return (
		<BrowserRouter>
			<div>
				<nav>
					<ul>
						<li>
							<Link to={"/"}>
								Go Home
							</Link>
						</li>
						<li>
							<Link to={"/testRoom"}>
								Chose Username
							</Link>
						</li>
						<li>
							<Link to={"/testRoom/testUsername"}>
								Join Room
							</Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/:roomId" element={<ChoseUsername />} />
					<Route path="/:roomId/:username" element={<JoinRoom />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
