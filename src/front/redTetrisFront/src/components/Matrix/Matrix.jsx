import  "./Matrix.css"
import {useState} from "react";

const   getTexture = (type) => {
	switch (type) {
		case "I":       return '/src/assets/textures/minimalist/I.png';
		case "J":       return '/src/assets/textures/minimalist/J.png';
		case "L":       return '/src/assets/textures/minimalist/L.png';
		case "O":       return '/src/assets/textures/minimalist/O.png';
		case "S":       return '/src/assets/textures/minimalist/S.png';
		case "T":       return '/src/assets/textures/minimalist/T.png';
		case "Z":       return '/src/assets/textures/minimalist/Z.png';
		case "EMPTY":   return '/src/assets/textures/minimalist/empty.png';
		case "SHADOW":  return '/src/assets/textures/minimalist/shadow.png';
		case "GARBAGE": return '/src/assets/textures/minimalist/garbage.png';
		case "MATRIX":  return '/src/assets/textures/minimalist/matrix.png';
		case "HOLD":    return '/src/assets/textures/minimalist/hold.png';
		case "BAGS":    return '/src/assets/textures/minimalist/bags.png';
	}
}

const   Mino = ({type, width, height, id}) => {
	const   [currentType, setCurrentType] = useState("EMPTY");
	const   [currentTexture, setCurrentTexture] = useState(getTexture("EMPTY"));

	if (currentType !== type.texture) {
		setCurrentType(type.texture);
		setCurrentTexture(getTexture(type.texture));
	}

	return (
		<img src={currentTexture} style={{ width: `${width}px`, height: `${height}px` }} alt={type} id={id} />
	);
}

const   Rows = ({row, width, height, id}) => {
	return (
		<div className={"rowContainer"} style={{ width: `${width}px`, height: `${height}px` }}>
			<Mino type={row[0]} width={32} height={32} id={id + "_0"}/>
			<Mino type={row[1]} width={32} height={32} id={id + "_1"}/>
			<Mino type={row[2]} width={32} height={32} id={id + "_2"}/>
			<Mino type={row[3]} width={32} height={32} id={id + "_3"}/>
			<Mino type={row[4]} width={32} height={32} id={id + "_4"}/>
			<Mino type={row[5]} width={32} height={32} id={id + "_5"}/>
			<Mino type={row[6]} width={32} height={32} id={id + "_6"}/>
			<Mino type={row[7]} width={32} height={32} id={id + "_7"}/>
			<Mino type={row[8]} width={32} height={32} id={id + "_8"}/>
			<Mino type={row[9]} width={32} height={32} id={id + "_9"}/>
		</div>
	);
}

const   Matrix = ({ matrix, width, height, id }) => {
	return (
		<div className={"matrixContainer"}>
			<div className={"matrixGrid"}>
				<div className={"colContainer"} style={{width: `${width}px`, height: `${height}px`}} id={id}>
					<Rows row={matrix[20]} width={32 * 10} height={32} id={id + "_0"}/>
					<Rows row={matrix[21]} width={32 * 10} height={32} id={id + "_1"}/>
					<Rows row={matrix[22]} width={32 * 10} height={32} id={id + "_2"}/>
					<Rows row={matrix[23]} width={32 * 10} height={32} id={id + "_3"}/>
					<Rows row={matrix[24]} width={32 * 10} height={32} id={id + "_4"}/>
					<Rows row={matrix[25]} width={32 * 10} height={32} id={id + "_5"}/>
					<Rows row={matrix[26]} width={32 * 10} height={32} id={id + "_6"}/>
					<Rows row={matrix[27]} width={32 * 10} height={32} id={id + "_7"}/>
					<Rows row={matrix[28]} width={32 * 10} height={32} id={id + "_8"}/>
					<Rows row={matrix[29]} width={32 * 10} height={32} id={id + "_9"}/>
					<Rows row={matrix[30]} width={32 * 10} height={32} id={id + "_10"}/>
					<Rows row={matrix[31]} width={32 * 10} height={32} id={id + "_11"}/>
					<Rows row={matrix[32]} width={32 * 10} height={32} id={id + "_12"}/>
					<Rows row={matrix[33]} width={32 * 10} height={32} id={id + "_13"}/>
					<Rows row={matrix[34]} width={32 * 10} height={32} id={id + "_14"}/>
					<Rows row={matrix[35]} width={32 * 10} height={32} id={id + "_15"}/>
					<Rows row={matrix[36]} width={32 * 10} height={32} id={id + "_16"}/>
					<Rows row={matrix[37]} width={32 * 10} height={32} id={id + "_17"}/>
					<Rows row={matrix[38]} width={32 * 10} height={32} id={id + "_18"}/>
					<Rows row={matrix[39]} width={32 * 10} height={32} id={id + "_19"}/>
				</div>
			</div>
		</div>
	);
}

export default Matrix;