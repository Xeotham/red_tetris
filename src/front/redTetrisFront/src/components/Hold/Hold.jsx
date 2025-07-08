import './Hold.css'
import {useState} from "react";
import {getTexture} from "../../utils.jsx";
import Tetrimino from "../Tetrimino/Tetrimino.jsx";

const   HoldPiece = ({ type }) => {
	const   [ holdType, setHoldType ] = useState(type || "EMPTY");

	if (holdType !== type) {
		setHoldType(type !== "None" ? type : "EMPTY");
	}

	return (
		<div className="holdPiece">
			<Tetrimino minoType={holdType}/>
		</div>
		)
}

const   Hold = ({ holdPiece, className }) => {
	return (
		<div className="hold">
			<div className="holdTitle">HOLD</div>
			<div className="holdPiece">
				{holdPiece ? (
					// Assuming holdPiece is a component that renders the piece
					<HoldPiece type={holdPiece.name} />
				) : (
					<div className="empty">EMPTY</div>
				)}
			</div>
		</div>
	)
}

export default Hold;