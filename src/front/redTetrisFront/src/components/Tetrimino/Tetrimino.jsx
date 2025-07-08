import "./Tetrimino.css"
import {getTexture} from "../../utils.jsx";

const   Tetrimino = ({minoType}) => {
	const    tetriminoPatterns = {
		"I": [
			[ 1, 1, 1, 1 ],
		],
		"J": [
			[ 1, 0, 0 ],
			[ 1, 1, 1 ],
		],
		"L": [
			[ 0, 0, 1 ],
			[ 1, 1, 1 ],
		],
		"O": [
			[ 1, 1 ],
			[ 1, 1 ],
		],
		"S": [
			[ 0 ,1, 1 ],
			[ 1, 1, 0 ],
		],
		"T": [
			[ 0, 1, 0 ],
			[ 1, 1, 1 ],
		],
		"Z": [
			[ 1, 1, 0 ],
			[ 0, 1, 1 ],
		],
	}

	if (!minoType || minoType === "EMPTY") {
		return (
			<div className="tetrimino">
				<img src={getTexture("EMPTY")} alt="empty" />
			</div>
		)
	}

	return (
		<div>
			<div className="tetrimino">
				{
					tetriminoPatterns[minoType].map((row, rowIndex) => (
					<div key={rowIndex} className="tetriminoRow" style={{height: "32px"}}>
						{row.map((cell, cellIndex) => (
							<img src={cell ? getTexture(minoType) : getTexture("EMPTY")} alt={cellIndex}/>
						))}
					</div>
				))}
			</div>
		</div>
	)

}

export default Tetrimino;