import "./Tetrimino.css"
import { getTexture } from "../../utils.jsx";

const   Tetrimino = ({minoType, texture}) => {

	const   getTetriminoPattern = (type) => {
		switch (type) {
			case "I": return  [[ 1, 1, 1, 1 ]];
			case "J": return  [[ 1, 0, 0 ], [ 1, 1, 1 ]];
			case "L": return  [[ 0, 0, 1 ], [ 1, 1, 1 ]];
			case "O": return  [[ 1, 1 ], [ 1, 1 ]];
			case "S": return  [[ 0 ,1, 1 ], [ 1, 1, 0 ]];
			case "T": return  [[ 0, 1, 0 ], [ 1, 1, 1 ]];
			case "Z": return  [[ 1, 1, 0 ], [ 0, 1, 1 ]];
			default: return [[ 0 ]]; // Empty or unknown type
		}
	}

	if (!minoType || minoType === "EMPTY") {
		return (
			<div className="tetrimino">
				<img className={"mino"} src={getTexture("EMPTY")} alt="empty" />
			</div>
		)
	}

	if (!texture)
		texture = getTexture(minoType);

	return (
		<div>
			<div className="tetrimino">
				{
					getTetriminoPattern(minoType).map((row, rowIndex) => (
					<div key={rowIndex} className="tetriminoRow" style={{height: "32px"}}>
						{
							row.map((cell, cellIndex) => (
							<img key={cellIndex} className={"mino"} src={cell ? texture : getTexture("EMPTY")} alt={cellIndex}/>
						))
						}
					</div>
				))}
			</div>
		</div>
	)

}

export default Tetrimino;