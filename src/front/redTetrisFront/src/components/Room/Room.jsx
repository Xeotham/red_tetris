import { useParams } from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import "./Room.css";
import {useCallback, useEffect, useState} from "react";
import { io } from "socket.io-client";
import { address } from "../../main.jsx";
import { useNavigate } from "react-router-dom";
import {clamp} from "ramda";
import {useSocket} from "../../hooks/socket/useSocket.jsx";
import RoomBoard from "../RoomBoard/RoomBoard.jsx";

const abs = (value) => {
	return value < 0 ? -value : value;
}

const Square1 = ({dis, s}) => {
	return (
		<div id="roomSettingsSquare1" className="settingBox">
			<div className="inSettingBox">
				<label id="isPrivate" className="labelSettings" htmlFor="is-private">Is private : </label>
				<input type="checkbox" id="is-private" name="is-private" defaultChecked={s.isPrivate} disabled={dis}/>
			</div>

			<div className="inSettingBox">
				<label id="isVersus" className="labelSettings" htmlFor="is-versus">Is versus : </label>
				<input type="checkbox" id="is-versus" name="is-versus" defaultChecked={s.isVersus} disabled={dis}/>
			</div>

			<div className="inSettingBox">
				<label id="showShadow" className="labelSettings" htmlFor="show-shadow">Show shadow : </label>
				<input type="checkbox" id="show-shadow" name="show-shadow" defaultChecked={s.showShadowPiece}
					   disabled={dis}/>
			</div>

			<div className="inSettingBox">
				<label id="showBags" className="labelSettings" htmlFor="show-bags">Show bags : </label>
				<input type="checkbox" id="show-bags" name="show-bags" defaultChecked={s.showBags} disabled={dis}/>
			</div>

			<div className="inSettingBox">
				<label id="holdAllowed" className="labelSettings" htmlFor="hold-allowed">Hold allowed : </label>
				<input type="checkbox" id="hold-allowed" name="hold-allowed" defaultChecked={s.holdAllowed}
					   disabled={dis}/>
			</div>

			<div className="inSettingBox">
				<label id="showHold" className="labelSettings" htmlFor="show-hold">Show hold : </label>
				<input type="checkbox" id="show-hold" name="show-hold" defaultChecked={s.showHold} disabled={dis}/>
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
				<input type="checkbox" id="infinite-movement" name="infinite-movement"
					   defaultChecked={s.infiniteMovement} disabled={dis}/>
			</div>
		</div>
	);
}

const Square2 = ({dis, s}) => {
	return (
		<div id="roomSettingsSquare2" className="settingBox">
			<div className="inSettingBox">
				<label className="labelSettings" htmlFor="rotationSelect">Rotation : </label>
				<select name="rotationSelect" id="rotationSelect" disabled={dis}
						style={{width: "45%", borderRadius: "10px"}}>
					<option value="SRSX">SRS-X</option>
					<option value="SRS">SRS</option>
					<option value="original">Original</option>
				</select>
			</div>

			<div className="inSettingBox">
				<label id="lockTime" className="labelSettings" htmlFor="lock-time">Lock time : </label>
				<input type="number" id="lock-time" name="lock-time" style={{width: "25%", borderRadius: "10px"}}
					   disabled={dis} min={-1}/>
			</div>

			<div className="inSettingBox">
				<label id="spawnARE" className="labelSettings" htmlFor="spawn-ARE">Spawn ARE : </label>
				<input type="number" id="spawn-ARE" name="spawn-ARE" style={{width: "25%", borderRadius: "10px"}}
					   disabled={dis} defaultValue={s.spawnARE || "0"}/>
			</div>

			<div className="inSettingBox">
				<label id="softDropAmp" className="labelSettings" htmlFor="soft-drop-amp">SoftDrop amplifier
					: </label>
				<input type="number" id="soft-drop-amp" name="soft-drop-amp"
					   style={{width: "25%", borderRadius: "10px"}}
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
	);
}

	const Square3 = ({dis, s}) => {
	return (
		<div id="roomSettingsSquare3" className="settingBox">
			<div className="inSettingBox">
				<label className="labelSettings" htmlFor="musicSelect">Music : </label>
				<select name="musicSelect" id="musicSelect" disabled={dis}
						style={{width: "70%", borderRadius: "10px"}}>
					<option value="none">No Music</option>
					<option value="bgm1">Tetoris</option>
					<option value="bgm2">Disturbing the peace</option>
					<option value="bgm3">Jump up, Super Star!</option>
					<option value="bgm4">Submerciful</option>
					<option value="bgm5">chirpsichord</option>
				</select>
			</div>

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
	);
}

const   SettingsScreen = ({roomId, username, settingsContainer, boardContainer, abortController}) => {
	const navigate = useNavigate();

	const [s, setS] = useState({nbPlayers: 0, isPrivate: true}); // Placeholder for the number of players, replace with actual state or props as needed.
	const [invalidName, setInvalidName] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [form, setForm] = useState(null);
	const socket = useSocket();

	const saveMultiplayerRoomSettings = useCallback(() => {
		const v = {
			"0": parseInt((document.getElementById("lock-time")).value, 10),
			"1": parseInt((document.getElementById("spawn-ARE")).value, 10),
			"2": parseFloat((document.getElementById("soft-drop-amp")).value),
			"3": parseInt((document.getElementById("level")).value, 10),
		};

		console.log("musicSelectValue:", (document.getElementById("musicSelect"))?.value);

		const newS = {
			"isPrivate": (document.getElementById("is-private"))?.checked,
			"isVersus": s.nbPlayers > 2 ? false : (document.getElementById("is-versus"))?.checked,
			"showShadowPiece": (document.getElementById("show-shadow"))?.checked,
			"showBags": (document.getElementById("show-bags"))?.checked,
			"holdAllowed": (document.getElementById("hold-allowed"))?.checked,
			"showHold": (document.getElementById("show-hold"))?.checked,
			"infiniteHold": (document.getElementById("infinite-hold"))?.checked,
			"infiniteMovement": (document.getElementById("infinite-movement"))?.checked,
			"rotationType": (document.getElementById("rotationSelect"))?.value,
			"lockTime": isNaN(v["0"]) ? 500 : clamp(-1, abs(v["0"]), v["0"]), // Lock time must be >= -1
			"spawnARE": isNaN(v["1"]) ? 0 : clamp(0, abs(v["1"]), v["1"]), // Spawn ARE must be >= 0
			"softDropAmp": isNaN(v["2"]) ? 1.5 : clamp(0.1, abs(v["2"]), v["2"]), // Soft drop amp must be > 0
			"level": isNaN(v["3"]) ? 4 : clamp(1, 15, v["3"]),
			"isLevelling": (document.getElementById("is-leveling"))?.checked,
			"music": (document.getElementById("musicSelect"))?.value,
			"seed": (document.getElementById("seed"))?.value || "error",
			"resetSeedOnRetry": (document.getElementById("reset-seed-on-retry"))?.checked,
			"canRetry": (document.getElementById("can-retry"))?.checked,
			"nbPlayers": s.nbPlayers,
		}
		setS(newS);
		document.getElementById("is-versus").checked = newS["versus"];
		document.getElementById("lock-time").value = newS["lockTime"].toString();
		document.getElementById("spawn-ARE").value = newS["spawnARE"].toString();
		document.getElementById("soft-drop-amp").value = newS["softDropAmp"].toString();
		document.getElementById("level").value = newS["level"].toString();
		// console.log("sending settings: ", newS);
		socket?.emit("multiplayerRoomCommand", "settings", {roomCode: roomId, settings: newS});

	});

	// useEffect to handle the form submission and save settings
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
		const backButton = document.getElementById("BackButton");
		if (backButton) {
			backButton.addEventListener("click", () => {
				abortController.abort();
				socket.emit("quitMultiplayerRoom", roomId);
				navigate("/find-room");
			} );
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

	// TODO : implement the start game logic
	const startGame = (isOwner) => {
		if (!isOwner)
			return ;

		socket.emit("multiplayerRoomCommand", "start", {roomCode: roomId});
	}

	useEffect(() => {
		socket.emit("joinMultiplayerRoom", roomId, username);

		socket.on("MULTIPLAYER_OWNER", (isRoomOwner) => {
			const newIsOwner = JSON.parse(isRoomOwner);
			setIsOwner(newIsOwner);
		});

		socket.on("MULTIPLAYER_SETTINGS", (settings) => {
			form?.removeEventListener("change", saveMultiplayerRoomSettings);
			const newSettings = JSON.parse(settings);
			setS(newSettings);
			if (!newSettings)
				return ;
			document.getElementById("is-private").checked = newSettings?.isPrivate;
			document.getElementById("is-versus").checked = newSettings?.isVersus;
			document.getElementById("show-shadow").checked = newSettings?.showShadowPiece;
			document.getElementById("show-bags").checked = newSettings?.showBags;
			document.getElementById("hold-allowed").checked = newSettings?.holdAllowed;
			document.getElementById("show-hold").checked = newSettings?.showHold;
			document.getElementById("infinite-hold").checked = newSettings?.infiniteHold;
			document.getElementById("infinite-movement").checked = newSettings?.infiniteMovement;
			document.getElementById("lock-time").value = newSettings?.lockTime;
			document.getElementById("rotationSelect").value = newSettings?.rotationType || "SRSX";
			document.getElementById("spawn-ARE").value = newSettings?.spawnARE || "0";
			document.getElementById("soft-drop-amp").value = newSettings?.softDropAmp
				? newSettings?.softDropAmp.toString() : "1.5";
			document.getElementById("level").value = newSettings?.level || "4";
			document.getElementById("is-leveling").checked = newSettings?.isLevelling;
			document.getElementById("musicSelect").value = newSettings?.music || "bgm1";
			document.getElementById("seed").value = newSettings?.seed || "error";
			document.getElementById("reset-seed-on-retry").checked = newSettings?.resetSeedOnRetry;
			document.getElementById("can-retry").checked = newSettings?.canRetry;
			form?.addEventListener("change", saveMultiplayerRoomSettings);
		});

		return () => {
			// socket.disconnect();
		};
	}, [roomId]);

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

	return (
		<div id="room" className="tetrisWindowBkg">
			<div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "6%"}}>
				<button id="BackButton" className="backButton">Back</button>
				<div className="playerText">Player : {username}</div>
			</div>

			<div style={{marginBottom: "-2.5%"}}></div>

			<div id="startBox" style={{width: "100%", height: "6%"}}>
				<div style={{display: "flex", alignItems: "left", width: "100%", height: "100%"}}>
					<button className="playButton" id="playButton" onClick={() => startGame(isOwner)}>Start</button>
					{/* TODO : change, this is not aligned correctly when resizing*/}
					<div id="clipboardCopy" className="copyCodeBox">
						<div style={{fontSize: "1.2em", marginTop: "2.25%"}}>{roomId}</div>
						<div style={{
							fontSize: ".8em", textDecorationLine: "underline",
							textUnderlineOffset: "35%"
						}}>Copy code
						</div>
					</div>
				</div>
				<div className="participantsText">Players : {s.nbPlayers}</div>
			</div>

			<div style={{marginBottom: "3%"}}></div>

			<div id="roomSettingsTitle" style={{width: "100%", height: "4%"}}>
				<div style={{
					width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)",
					userSelect: "none"
				}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				</div>
				<div className="settingsTitle">Room settings</div>
				<div style={{
					width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)",
					userSelect: "none"
				}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				</div>
			</div>

			<div style={{marginBottom: "3%"}}></div>

			<form id="roomSettingsForm" className="roomSettingsForm">
				<Square1 dis={!isOwner} s={s}/>
				<Square2 dis={!isOwner} s={s}/>
				<Square3 dis={!isOwner} s={s}/>
			</form>
		</div>
	)
}

const Room = () => {
	const   {roomId, username} = useParams();
	const   [settingsContainer, setSettingContainer] = useState(null);
	const   [boardContainer, setBoardContainer] = useState(null);
	const   [abortController, setAbortController] = useState(new AbortController());

	useEffect(() => {
		setSettingContainer(document.getElementById("settingsContainer"));
		setBoardContainer(document.getElementById("boardContainer"));
	})

	return (
		<div>
			<div id={"settingsContainer"} style={{display: "block"}}>
				{settingsContainer && boardContainer && (
					<SettingsScreen
						roomId={roomId}
						username={username}
						settingsContainer={settingsContainer}
						boardContainer={boardContainer}
						abortController={abortController}
					/>
				)}
			</div>
			<div id={"boardContainer"} className={"boardContainer"} style={{display: "none"}}>
				{settingsContainer && boardContainer && (
					<RoomBoard
						settingsContainer={settingsContainer}
						boardContainer={boardContainer}
			            abortController={abortController}
						username={username}
					/>
				)}
			</div>
		</div>
	);
}
export default Room;