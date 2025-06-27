import  "./Matrix.css"

const   getTexture = (type) => {
	switch (type) {
		case "I": return '/src/assets/textures/minimalist/I.png';
		case "J": return '/src/assets/textures/minimalist/J.png';
		case "L": return '/src/assets/textures/minimalist/L.png';
		case "O": return '/src/assets/textures/minimalist/O.png';
		case "S": return '/src/assets/textures/minimalist/S.png';
		case "T": return '/src/assets/textures/minimalist/T.png';
		case "Z": return '/src/assets/textures/minimalist/Z.png';
		case "EMPTY": return '/src/assets/textures/minimalist/empty.png';
		case "SHADOW": return '/src/assets/textures/minimalist/shadow.png';
		case "GARBAGE": return '/src/assets/textures/minimalist/garbage.png';
		case "MATRIX": return '/src/assets/textures/minimalist/matrix.png';
		case "HOLD": return '/src/assets/textures/minimalist/hold.png';
		case "BAGS": return '/src/assets/textures/minimalist/bags.png';
	}
}

const   Mino = ({type, width, height}) => {
	const texture = getTexture(type.texture);
	return (
		<img src={texture} style={{ width: `${width}px`, height: `${height}px` }} alt={type} />
	);
}

const   Rows = ({row, width, height}) => {
	return (
		<div className={"rowContainer"} style={{ width: `${width}px`, height: `${height}px` }}>
			<Mino type={row[0]} width={32} height={32} />
			<Mino type={row[1]} width={32} height={32} />
			<Mino type={row[2]} width={32} height={32} />
			<Mino type={row[3]} width={32} height={32} />
			<Mino type={row[4]} width={32} height={32} />
			<Mino type={row[5]} width={32} height={32} />
			<Mino type={row[6]} width={32} height={32} />
			<Mino type={row[7]} width={32} height={32} />
			<Mino type={row[8]} width={32} height={32} />
			<Mino type={row[9]} width={32} height={32} />
		</div>
	);
}

const   Matrix = ({ matrix, width, height }) => {
	return (
		<div className={"matrixContainer"}>
			<div className={"matrixGrid"}>
				<div className={"colContainer"} style={{width: `${width}px`, height: `${height}px`}}>
					<Rows row={matrix[19]} width={32 * 10} height={32}/>
					<Rows row={matrix[20]} width={32 * 10} height={32}/>
					<Rows row={matrix[21]} width={32 * 10} height={32}/>
					<Rows row={matrix[22]} width={32 * 10} height={32}/>
					<Rows row={matrix[23]} width={32 * 10} height={32}/>
					<Rows row={matrix[24]} width={32 * 10} height={32}/>
					<Rows row={matrix[25]} width={32 * 10} height={32}/>
					<Rows row={matrix[26]} width={32 * 10} height={32}/>
					<Rows row={matrix[27]} width={32 * 10} height={32}/>
					<Rows row={matrix[28]} width={32 * 10} height={32}/>
					<Rows row={matrix[29]} width={32 * 10} height={32}/>
					<Rows row={matrix[30]} width={32 * 10} height={32}/>
					<Rows row={matrix[31]} width={32 * 10} height={32}/>
					<Rows row={matrix[32]} width={32 * 10} height={32}/>
					<Rows row={matrix[33]} width={32 * 10} height={32}/>
					<Rows row={matrix[34]} width={32 * 10} height={32}/>
					<Rows row={matrix[35]} width={32 * 10} height={32}/>
					<Rows row={matrix[36]} width={32 * 10} height={32}/>
					<Rows row={matrix[37]} width={32 * 10} height={32}/>
					<Rows row={matrix[38]} width={32 * 10} height={32}/>
				</div>
			</div>
		</div>
	);
}

export default Matrix;