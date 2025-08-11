import { useParams } from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import "./room.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { address } from "../../main.jsx";
import { useNavigate } from "react-router-dom";

const abs = (value) => {
	return value < 0 ? -value : value;
}

const clamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max));
}

const   Room = () => {
	const   { roomId, username } = useParams();
	const navigate = useNavigate();

	const   [s, setS] = useState({nbPlayers: 0, isPrivate: true, canRetry: true}); // Placeholder for the number of players, replace with actual state or props as needed.
	const   [dis, setDis] = useState(true);
	const   [form, setForm] = useState(null);
	const	[socket, setSocket] = useState(null);

	const saveMultiplayerRoomSettings = () => {
		let values = {};
		values["versus"] = (document.getElementById("is-versus"))?.checked;
		values["0"] = parseInt((document.getElementById("lock-time")).value, 10);
		values["1"] = parseInt((document.getElementById("spawn-ARE")).value, 10);
		values["2"] = parseFloat((document.getElementById("soft-drop-amp")).value);
		values["3"] = parseInt((document.getElementById("level")).value, 10);
		const nbPlayers = s.nbPlayers || 0;
		values["versus"] === true && nbPlayers > 2 ? values["versus"] = false : true;
		isNaN(values["0"]) ? values["0"] = 500 : values["0"] = clamp(values["0"], -1, abs(values["0"]));
		isNaN(values["1"]) ? values["1"] = 0 : values["1"] = clamp(values["1"], 0, abs(values["1"])); // Spawn ARE must be >= 0 and positive
		isNaN(values["2"]) ? values["2"] = 1.5 : values["2"] = clamp(values["2"], 0.1, abs(values["2"])); // Soft drop amp must be > 0 && positive
		isNaN(values["3"]) ? values["3"] = 4 : values["3"] = clamp(values["3"], 1, 15); // Level must be between 1 and 15

		document.getElementById("is-versus").checked = values["versus"];
		document.getElementById("lock-time").value = values["0"].toString();
		document.getElementById("spawn-ARE").value = values["1"].toString();
		document.getElementById("soft-drop-amp").value = values["2"].toString();
		document.getElementById("level").value = values["3"].toString();

		// console.log("private: ", (document.getElementById("is-private"))?.checked);

		const newS = {
			"isPrivate": (document.getElementById("is-private"))?.checked,
			"isVersus": values["versus"],
			"showShadowPiece": (document.getElementById("show-shadow"))?.checked,
			"showBags": (document.getElementById("show-bags"))?.checked,
			"holdAllowed": (document.getElementById("hold-allowed"))?.checked,
			"showHold": (document.getElementById("show-hold"))?.checked,
			"infiniteHold": (document.getElementById("infinite-hold"))?.checked,
			"infiniteMovement": (document.getElementById("infinite-movement"))?.checked,
			"lockTime": values["0"],
			"spawnARE": values["1"],
			"softDropAmp": values["2"],
			"level": values["3"],
			"isLevelling": (document.getElementById("is-leveling"))?.checked,
			"seed": (document.getElementById("seed"))?.value || "error",
			"resetSeedOnRetry": (document.getElementById("reset-seed-on-retry"))?.checked,
			"canRetry": (document.getElementById("can-retry"))?.checked,
			"nbPlayers": nbPlayers,

		}
		setS(newS);
		if (!socket)
			return ;
		// console.log("sending settings: ", newS);
		socket.emit("multiplayerRoomCommand", "settings", {roomCode: roomId, settings: newS});

	}
	useEffect(() => {
		const formElement = document.getElementById("roomSettingsForm");
		setForm(formElement);
		if (formElement) {
			formElement.addEventListener("change", saveMultiplayerRoomSettings);
			return () => {
				formElement.removeEventListener("change", saveMultiplayerRoomSettings);
			};
		}
	}, [saveMultiplayerRoomSettings]);

	useEffect(() => {
		const newSocket = io(`http://${address}`);
		setSocket(newSocket);

		newSocket.emit("joinMultiplayerRoom", roomId);

		newSocket.on("MULTIPLAYER_OWNER", (isOwner) => {
			const newIsOwner = JSON.parse(isOwner);
			setDis(!newIsOwner);
		});

		newSocket.on("MULTIPLAYER_SETTINGS", (settings) => {
			form?.removeEventListener("change", saveMultiplayerRoomSettings);
			const newSettings = JSON.parse(settings);
			setS(newSettings);
			// console.log("Settings received:", newSettings);
			document.getElementById("is-private").checked = newSettings?.isPrivate;
			document.getElementById("is-versus").checked = newSettings?.isVersus;
			document.getElementById("show-shadow").checked = newSettings?.showShadowPiece;
			document.getElementById("show-bags").checked = newSettings?.showBags;
			document.getElementById("hold-allowed").checked = newSettings?.holdAllowed;
			document.getElementById("show-hold").checked = newSettings?.showHold;
			document.getElementById("infinite-hold").checked = newSettings?.infiniteHold;
			document.getElementById("infinite-movement").checked = newSettings?.infiniteMovement;
			document.getElementById("lock-time").value = newSettings?.lockTime || "500";
			document.getElementById("spawn-ARE").value = newSettings?.spawnARE || "0";
			document.getElementById("soft-drop-amp").value = newSettings?.softDropAmp
				? newSettings?.softDropAmp.toString() : "1.5";
			document.getElementById("level").value = newSettings?.level || "4";
			document.getElementById("is-leveling").checked = newSettings?.isLevelling;
			document.getElementById("seed").value = newSettings?.seed || "error";
			document.getElementById("reset-seed-on-retry").checked = newSettings?.resetSeedOnRetry;
			document.getElementById("can-retry").checked = newSettings?.canRetry;
			form?.addEventListener("change", saveMultiplayerRoomSettings);
		});

		return () => {
			newSocket.disconnect();
		};
	}, [roomId]);

	useEffect(() => {
		const backButton = document.getElementById("BackButton");
		if (backButton) {
			backButton.addEventListener("click", () => navigate("/find-room") );
			return () => backButton.removeEventListener("click", () => navigate("/find-room") );
		}
	});

	useEffect(() => {
		const clipboardCopy = document.getElementById("clipboardCopy");
		if (clipboardCopy) { // FIXME : missing ip
			clipboardCopy.addEventListener("click", () =>
				navigator.clipboard.writeText("http://" + "localhost" + ":" + import.meta.env.VITE_FRONT_PORT + "/" + roomId) );
			return () => clipboardCopy.removeEventListener("click", () =>
				navigator.clipboard.writeText("http://" + "localhost" + ":" + import.meta.env.VITE_FRONT_PORT + "/" + roomId) );
		}
	});

	// useEffect(() => {
	// 	const startButton = document.getElementById("playButton");
	// 	if (startButton) {
	// 		startButton.addEventListener("click", () => console.log("Start button clicked") );
	// 		return () => startButton.removeEventListener("click", () => console.log("Start button clicked") );
	// 	}
	// });

	if ((/^[A-Z]+$/.test(roomId)) === false || roomId.length !== 4) {
		return (
			<>
				Invalid room ID. <br />
				Please use a valid room code. <br />
				Valid room codes are 4 uppercase letters (A-Z). <br />
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10%", marginTop: "100%" }}>
					<TetrisButtons onClick={() => window.location.href = "/"}>Go to Home</TetrisButtons>
				</div>
			</>
		);
	}

	// TODO : implement the start game logic
	const startGame = () => {
		console.log("Start button clicked");
	}

	return (
		<div id="room" className="tetrisWindowBkg">
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "6%" }}>
				<button id="BackButton" className="backButton">Back</button>
				<div className="playerText">Player : {username}</div>
			</div>

			<div style={{marginBottom: "-2.5%"}}></div>

			<div id="startBox" style={{width: "100%", height: "6%"}}>
				<div style={{display: "flex", alignItems: "left", width: "100%", height: "100%"}}>
					<button className="playButton" id="playButton" onClick={startGame}>Start</button>
					{/* TODO : change, this is not aligned correctly when resizing*/}
					<div id="clipboardCopy" className="copyCodeBox">
						<div style={{fontSize: "1.2em", marginTop: "2.25%"}}>{roomId}</div>
						<div style={{
							fontSize: ".8em", textDecorationLine: "underline",
							textUnderlineOffset: "35%"
						}}>Copy code</div>
					</div>
				</div>
				<div className="participantsText">Players : {s.nbPlayers}</div>
			</div>

			<div style={{marginBottom: "3%"}}></div>

			<div id="roomSettingsTitle" style={{width: "100%", height: "4%"}}>
				<div style={{width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)",
				userSelect: "none"}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
				<div className="settingsTitle">Room settings</div>
				<div style={{width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)",
				userSelect: "none"}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
			</div>

			<div style={{marginBottom: "3%"}}></div>

			<form id="roomSettingsForm" className="roomSettingsForm">
				<div id="roomSettingsSquare1" className="settingBox">
					<div className="inSettingBox">
						<label id="isPrivate" className="labelSettings" htmlFor="is-private">Is private : </label>
						<input type="checkbox" id="is-private" name="is-private" defaultChecked={s.isPrivate}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="isVersus" className="labelSettings" htmlFor="is-versus">Is versus : </label>
						<input type="checkbox" id="is-versus" name="is-versus" defaultChecked={s.isVersus}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="showShadow" className="labelSettings" htmlFor="show-shadow">Show shadow : </label>
						<input type="checkbox" id="show-shadow" name="show-shadow" defaultChecked={s.showShadowPiece}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="showBags" className="labelSettings" htmlFor="show-bags">Show bags : </label>
						<input type="checkbox" id="show-bags" name="show-bags" defaultChecked={s.showBags}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="holdAllowed" className="labelSettings" htmlFor="hold-allowed">Hold allowed : </label>
						<input type="checkbox" id="hold-allowed" name="hold-allowed" defaultChecked={s.holdAllowed}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="showHold" className="labelSettings" htmlFor="show-hold">Show hold : </label>
						<input type="checkbox" id="show-hold" name="show-hold" defaultChecked={s.showHold}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="infiniteHold" className="labelSettings" htmlFor="infinite-hold">Infinite hold
							: </label>
						<input type="checkbox" id="infinite-hold" name="infinite-hold" defaultChecked={s.infiniteHold}
							   disabled={dis}/>
					</div>

					<div className="inSettingBox">
						<label id="infiniteMovement" className="labelSettings" htmlFor="infinite-movement">Infinite movement
							: </label>
						<input type="checkbox" id="infinite-movement" name="infinite-movement" defaultChecked={s.infiniteMovement}
							   disabled={dis}/>
					</div>
				</div>

				<div id="roomSettingsSquare2" className="settingBox">
					<div className="inSettingBox">
						<label id="lockTime" className="labelSettings" htmlFor="lock-time">Lock time : </label>
						<input type="number" id="lock-time" name="lock-time" style={{width: "25%", borderRadius: "10px"}}
							   disabled={dis} defaultValue={s.lockTime || "500"}/>
					</div>

					<div className="inSettingBox">
						<label id="spawnARE" className="labelSettings" htmlFor="spawn-ARE">Spawn ARE : </label>
						<input type="number" id="spawn-ARE" name="spawn-ARE" style={{width: "25%", borderRadius: "10px"}}
							   disabled={dis} defaultValue={s.spawnARE || "0"}/>
					</div>

					<div className="inSettingBox">
						<label id="softDropAmp" className="labelSettings" htmlFor="soft-drop-amp">SoftDrop amplifier
							: </label>
						<input type="number" id="soft-drop-amp" name="soft-drop-amp" style={{width: "25%", borderRadius: "10px"}}
							   disabled={dis} defaultValue={s.softDropAmp || "1.5"}/>
					</div>

					<div className="inSettingBox">
						<label id="levelLabel" className="labelSettings" htmlFor="level">Level : </label>
						<input type="number" id="level" name="level" style={{width: "25%", borderRadius: "10px"}}
							   disabled={dis} defaultValue={s.level || "4"}/>
					</div>

					<div className="inSettingBox">
						<label id="isLevelling" className="labelSettings" htmlFor="is-leveling">Is leveling : </label>
						<input type="checkbox" id="is-leveling" name="is-leveling"
							   defaultChecked={s.isLevelling} disabled={dis}/>
					</div>

				</div>

				<div id="roomSettingsSquare3" className="settingBox">
					<div className="inSettingBox">
						<label id="seedLabel" className="labelSettings" htmlFor="seed">Seed : </label>
						<input type="text" id="seed" name="seed" style={{width: "50%", borderRadius: "10px"}}
							   disabled={dis} defaultValue={s.seed || Date.now()}/>
					</div>
					<div className="inSettingBox">
						<label id="resetSeedOnRetry" className="labelSettings" htmlFor="reset-seed-on-retry">
							Reset seed on retry : </label>
						<input type="checkbox" id="reset-seed-on-retry" name="reset-seed-on-retry"
							   defaultChecked={s.resetSeedOnRetry} disabled={dis}/>
					</div>
					<div className="inSettingBox">
						<label id="canRetry" className="labelSettings" htmlFor="can-retry">Can retry : </label>
						<input type="checkbox" id="can-retry" name="can-retry"
							   defaultChecked={s.canRetry}
							   disabled={dis}/>
					</div>

				</div>
			</form>

		</div>
	);
}
export default Room;