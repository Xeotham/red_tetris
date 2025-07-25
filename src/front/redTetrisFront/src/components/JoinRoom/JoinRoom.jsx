import { useParams } from "react-router-dom";
import TetrisButtons from "../TetrisButtons/TetrisButtons.jsx";
import "./JoinRoom.css";

const   JoinRoom = () => {
	const   { roomId, username } = useParams();

	const s = {nbPlayers: 0, isPrivate: true}; // Placeholder for the number of players, replace with actual state or props as needed.
	const dis = false;

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
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "6%" }}>
				<button id="BackButton" className="backButton">Back</button>
				<div className="playerText">Player : {username}</div>
			</div>

			<div style={{marginBottom: "-2.5%"}}></div>

			<div id="startBox" style={{width: "100%", height: "6%"}}>
				<div style={{display: "flex", alignItems: "left", width: "100%", height: "100%"}}>
					<button className="playButton" onClick={() => {
					}}>Start</button>
					{/* TODO : change, this is not aligned correctly when resizing*/}
					<div className="copyCodeBox">
						<div style={{fontSize: "1.2em"}}>{roomId}</div>
						<div id="clipboardCopy" style={{
							fontSize: ".8em", textDecorationLine: "underline",
							textUnderlineOffset: "35%"
						}}>Copy code</div>
					</div>
				</div>
				<div className="participantsText">Players : {s.nbPlayers}</div>
			</div>

			<div style={{marginBottom: "3%"}}></div>

			<div id="roomSettingsTitle" style={{width: "100%", height: "4%"}}>
				<div style={{width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)"}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
				<div className="settingsTitle">Room settings</div>
				<div style={{width: "100%", height: "33%", fontSize: "2vmin", color: "rgb(231, 170, 44)"}}>~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
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
						<input type="checkbox" id="show-shadow" name="show-shadow" defaultChecked={s.showShadow}
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
						<label id="infiniteMovment" className="labelSettings" htmlFor="infinite-movment">Infinite movement
							: </label>
						<input type="checkbox" id="infinite-movment" name="infinite-movment" defaultChecked={s.infiniteMovment}
							   disabled={dis}/>
					</div>
				</div>

				<div id="roomSettingsSquare2" className="settingBox">
					<div className="inSettingBox">
						<label id="lockTime" className="labelSettings" htmlFor="lock-time">Lock time : </label>
						<input type="number" id="lock-time" name="lock-time" style={{width: "25%"}}
							   disabled={dis} defaultValue={s.lockTime || "500"}/>
					</div>

					<div className="inSettingBox">
						<label id="spawnARE" className="labelSettings" htmlFor="spawn-ARE">Spawn ARE : </label>
						<input type="number" id="spawn-ARE" name="spawn-ARE" style={{width: "25%"}}
							   disabled={dis} defaultValue={s.spawnARE || "0"}/>
					</div>

					<div className="inSettingBox">
						<label id="softDropAmp" className="labelSettings" htmlFor="soft-drop-amp">SoftDrop amplifier
							: </label>
						<input type="number" id="soft-drop-amp" name="soft-drop-amp" style={{width: "25%"}}
							   disabled={dis} defaultValue={s.softDropAmp || "1.5"}/>
					</div>

					<div className="inSettingBox">
						<label id="level" className="labelSettings" htmlFor="level">Level : </label>
						<input type="number" id="level" name="level" style={{width: "25%"}}
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
						<label id="seed" className="labelSettings" htmlFor="seed">Seed : </label>
						<input type="text" id="seed" name="seed" style={{width: "50%"}}
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

export default JoinRoom;