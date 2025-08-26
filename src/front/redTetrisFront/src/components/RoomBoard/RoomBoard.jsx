import "./RoomBoard.css";
import Matrix from "../Matrix/Matrix.jsx";
import {useEffect, useRef, useState} from "react";
import { sfxPlayer } from "../../sfxHandler.jsx";
import Hold from "../Hold/Hold.jsx";
import Bags from "../Bags/Bags.jsx";
import { useSocket } from "../../hooks/socket/useSocket.jsx";
import { getMusic } from "../../utils.jsx";

const   EndDisplay = ({stats, display = false, settingsContainer, boardContainer}) => {
	if (!stats) {
		return <div className={"statsDisplay"}></div>;
	}

	return (
		<div className={"statsDisplay"} style={{display: display ? "block" : "none"}}>
			<div className={"endTitle"}>GAME OVER</div>
			<div className={"score"}>Score: {stats.score}</div>

			<div className={"detailsTable"}>
				<div className={"infoTable"}>
					<div className={"infoTitle"}>Total Time:</div>
					<div className={"infoValue"}>{stats?.totalTime}</div>
					<div className={"infoTitle"}>Level:</div>
					<div className={"infoValue"}>{stats?.level}</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
					<div className={"infoTitle"}>Max Combo:</div>
					<div className={"infoValue"}>{stats?.maxCombo}</div>
					<div className={"infoTitle"}>Max B2B:</div>
					<div className={"infoValue"}>{stats?.maxB2B}</div>
					<div className={"infoTitle"}>Perfect Clears:</div>
					<div className={"infoValue"}>{stats?.perfectClears}</div>
					<div className={"infoTitle"}>Pieces:</div>
					<div className={"infoValue"}>{stats?.piecesPlaced} placed | {stats?.piecesPerSecond} / s</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
					<div className={"infoTitle"}>Keys:</div>
					<div className={"infoValue"}>{stats?.keysPressed} pressed | {stats?.keysPerPiece} / pieces
						| {stats?.keysPerSecond} / s
					</div>
					<div className={"infoTitle"}>Holds:</div>
					<div className={"infoValue"}>{stats?.holds}</div>
					<div className={"infoTitle"}>Lines:</div>
					<div className={"infoValue"}>{stats?.linesCleared} cleared | {stats?.linesPerMinute} / min</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
					<div className={"infoTitle"}>Attacks Sent:</div>
					<div className={"infoValue"}>{stats?.attacksSent} sent | {stats?.attacksSentPerMinute} / min</div>
					<div className={"infoTitle"}>Attacks Received:</div>
					<div className={"infoValue"}>{stats?.attacksReceived} received | {stats?.attacksReceivedPerMinute} / min</div>
					<div className={"infoSpacing"}/>
					<div className={"infoSpacing"}/>
				</div>
			</div>
			<div className={"clearsTable"}>
				<div className={"clearsInfoTitle"}>TYPE</div>
				<div className={"clearsInfoTitle"}>Zero</div>
				<div className={"clearsInfoTitle"}>Single</div>
				<div className={"clearsInfoTitle"}>Double</div>
				<div className={"clearsInfoTitle"}>Triple</div>
				<div className={"clearsInfoTitle"}>Quad</div>

				<div className={"clearsInfoKey"}>Clears</div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValue"}>{stats?.single}</div>
				<div className={"clearsInfoValue"}>{stats?.double}</div>
				<div className={"clearsInfoValue"}>{stats?.triple}</div>
				<div className={"clearsInfoValue"}>{stats?.quad}</div>

				<div className={"clearsInfoKey"}>Tspin</div>
				<div className={"clearsInfoValue"}>{stats?.tspinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinSingle}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinDouble}</div>
				<div className={"clearsInfoValue"}>{stats?.tspinTriple}</div>
				<div className={"clearsInfoValueEmpty"}></div>

				<div className={"clearsInfoKey"}>Mini Tspin</div>
				<div className={"clearsInfoValue"}>{stats?.miniTspinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.miniTspinSingle}</div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValueEmpty"}></div>
				<div className={"clearsInfoValueEmpty"}></div>

				<div className={"clearsInfoKey"}>Mini Spin</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinZero}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinSingle}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinDouble}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinTriple}</div>
				<div className={"clearsInfoValue"}>{stats?.miniSpinQuad}</div>
			</div>
			<div className={"backHomeButton"} onClick={ () => {
				boardContainer.style.display = "none";
				settingsContainer.style.display = "block";
				document.getElementsByClassName("statsDisplay")[0].style.display = "none";

			}} > Go Back </div>
		</div>
	);
}

const   ScoreDisplay = ({score}) => {
	return (
		<div className={"scoreDisplay"}>
			<div className={"scoreDisplayTitle"}>Score:</div>
			<div className={"scoreDisplayValue"}>{ score }</div>
		</div>
	)
}

const   GameStats = ({gameInfo}) => {
	return (
		<div className={"gameStats"}>
			<div className={"gameStatsKey"}>{"Level:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.level}</div>
			<div className={"gameStatsKey"}>{"Time:"}</div>
			<div className={"gameStatsValue"}>{new Date(gameInfo.time || 0).toISOString().substring(14, 23)}</div>
			<div className={"gameStatsKey"}>{"Goal:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.linesCleared + " / " + gameInfo.lineClearGoal}</div>
			<div className={"gameStatsKey"}>{"Pieces:"}</div>
			<div className={"gameStatsValue"}>{gameInfo.piecesPlaced + ", " + gameInfo.piecesPerSecond + "/s"}</div>
		</div>
	)
}


const OpponentBoard = ({ opponent, id }) => {
	const parentRef = useRef();

	if (!opponent || !opponent.matrix) {
		return (<></>)

	}

	return (
		<div className="opponentContainer" ref={parentRef} id={id}>
			<Matrix matrix={opponent.matrix} username={opponent.username} />
		</div>
	);
};

const RoomBoard = ({settingsContainer, boardContainer, abortController, username}) => {

	const   socket = useSocket();
	const   [game, setGame] = useState({
		matrix: null,
		bags: null,
		hold: null,
		canSwap: null,
		gameId: null,
		score: null,
		level: null,
		time: null,
		awaitingGarbage: null,
		linesCleared: null,
		lineClearGoal: null,
		piecesPlaced: null,
		piecesPerSecond: null
	});
	const   [stats, setStats] = useState({
		attacksReceived: 0,
		attacksReceivedPerMinute: 0,
		attacksSent: 0,
		attacksSentPerMinute: 0,
		double: 0,
		gameTime: 1956,
		holds: 0,
		isInRoom: false,
		keysPerPiece: 0,
		keysPerSecond: 0.0,
		keysPressed: 0,
		level: 0,
		linesCleared: 0,
		linesPerMinute: 0,
		maxB2B: 0,
		maxCombo: 0,
		miniSpinDouble: 0,
		miniSpinQuad: 0,
		miniSpinSingle: 0,
		miniSpinTriple: 0,
		miniSpinZero: 0,
		miniTspinSingle: 0,
		miniTspinZero: 0,
		perfectClears: 0,
		piecesPerSecond: 0.0,
		piecesPlaced: 0,
		quad: 0,
		score: 0,
		single: 0,
		totalTime: "",
		triple: 0,
		tspinDouble: 0,
		tspinSingle: 0,
		tspinTriple: 0,
		tspinZero: 0,
	});
	const   [displayStats, setDisplayStats] = useState(false);
	const   actualMusic = useRef(null);
	const   [leftOpponents, setLeftOpponents] = useState({
		matrix: null,
		username: null,
	});
	const   [rightOpponents, setRightOpponents] = useState({
		matrix: null,
		username: null,
	});

	const gameControllers = async (abortController) => {
		const signal = abortController.signal;
		const keydownHandler = async (event) => {
			if (!event.repeat) {
				socket.emit("keydown", event.key);
			}
		};
		const keyupHandler = async (event) => {
			if (!event.repeat)
				socket.emit("keyup", event.key)
		};

		document.addEventListener("keydown", keydownHandler, {signal});
		document.addEventListener("keyup", keyupHandler, {signal});
	}

	useEffect(() => {
		socket.on("GAME_START", (data) => {
			const   new_data = JSON.parse(data);
			setGame(new_data.game);
			setDisplayStats(false);
			settingsContainer.style.display = "none";
			boardContainer.style.display = "block";
		});

		socket.on("MULTIPLAYER_SPEC_JOIN", () => {
			settingsContainer.style.display = "none";
			boardContainer.style.display = "block";
			setDisplayStats(false);
		});

		socket.on("MULTIPLAYER_SPEC_LEAVE", () => {
			settingsContainer.style.display = "block";
			boardContainer.style.display = "none";
			setDisplayStats(false);
		});

		socket.on("GAME", (data) => {
			const new_data = JSON.parse(data);
			setGame(new_data.game);
			// console.log(game);
		});

		socket.on("EFFECT", (data) => {
			const new_data = JSON.parse(data);
			const sfx = sfxPlayer(new_data.type, new_data.value);


			sfx?.play();
		});

		socket.on("STATS", (data) => {
			const new_data = JSON.parse(data);
			document.getElementById("hideShowButton").style = {display: "block"};
			setStats(new_data.stats);
			setDisplayStats(true);
		})

		socket.on("MULTIPLAYER_OPPONENTS_GAMES", (data) => {
			const   gameList = JSON.parse(data).argument;

			setLeftOpponents({ matrix: gameList[0]?.game.matrix, username: gameList[0]?.username });
			setRightOpponents({ matrix: gameList[1]?.game.matrix, username: gameList[1]?.username });
		})

		socket.on("MUSIC", (data) => {
			const   new_data = JSON.parse(data);
			const   type = new_data.type;
			const   argument = new_data.argument;

			if (type === "BEGIN") {
				const music = getMusic(argument);

				console.log(music);

				if (music) {
					music.loop = true;
					music.volume = 0.30;
					music.play();
				}
				actualMusic.current = music;
			}
			else if (type === "END") {
				if (actualMusic.current) {
					actualMusic.current.pause();
					actualMusic.current.currentTime = 0;
					actualMusic.current = null;
				}
			}
		});

		gameControllers(abortController);

		return () => {
			abortController.abort();
		};
	}, []);
	const hideShowStats = () => {
		const hideShowButton = document.getElementById("hideShowButton");
		setDisplayStats(!displayStats);
		hideShowButton.textContent = (displayStats ? "Show stats" : "Hide stats");
	}

	return (
		<div className={"roomBoard"}>
			<div className={"hideShow"} id="hideShowButton" style={{display: "none"}} onClick={hideShowStats}>Hide stats</div>
			<div className={"opponentBoard"}>
				<OpponentBoard opponent={leftOpponents} id={"leftOpponents"}/>
			</div>
			<div className={"userBoard"}>
				<div className={"boardHold"}>
					<Hold holdPiece={{hold: game.hold, canSwap: game.canSwap}}/>
				</div>
				<div className={"boardMatrix"}>
					<Matrix matrix={game.matrix} width={320} height={640} username={game.username}/>
				</div>
				<div className={"boardBag"}>
					<Bags bags={game.bags}/>
				</div>
				<GameStats gameInfo={game} />
				<ScoreDisplay score={game.score} />
				<EndDisplay
					stats={stats}
					display={displayStats}
					settingsContainer={settingsContainer}
					boardContainer={boardContainer}
				/>
			</div>
			<div className={"opponentBoard"}>
				<OpponentBoard opponent={rightOpponents} id={"rightOpponents"}/>
			</div>
		</div>
	);
}

export default RoomBoard;