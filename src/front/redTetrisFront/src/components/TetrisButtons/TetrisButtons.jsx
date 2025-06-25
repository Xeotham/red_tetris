import  "./TetrisButtons.css"
import {type} from "ramda";

const   TetrisButtons = ({ id, onClick, children }) => {
	return (
		<div className={"tetris-button"} id={id} onClick={onClick}>
			{children}
		</div>
	)
}

export default TetrisButtons;