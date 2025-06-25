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

const   Mino = (type, width, height) => {
	const texture = getTexture(type);

	return (
		<img src={texture} style={{ width: `${width}px`, height: `${height}px` }} alt={type} />
	);
}

const   Rows = (row, width, height) => {
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
					<Rows row={matrix[0]} width={32 * 10} height={32}/>
					<Rows row={matrix[1]} width={32 * 10} height={32}/>
					<Rows row={matrix[2]} width={32 * 10} height={32}/>
					<Rows row={matrix[3]} width={32 * 10} height={32}/>
					<Rows row={matrix[4]} width={32 * 10} height={32}/>
					<Rows row={matrix[5]} width={32 * 10} height={32}/>
					<Rows row={matrix[6]} width={32 * 10} height={32}/>
					<Rows row={matrix[7]} width={32 * 10} height={32}/>
					<Rows row={matrix[8]} width={32 * 10} height={32}/>
					<Rows row={matrix[9]} width={32 * 10} height={32}/>
					<Rows row={matrix[10]} width={32 * 10} height={32}/>
					<Rows row={matrix[11]} width={32 * 10} height={32}/>
					<Rows row={matrix[12]} width={32 * 10} height={32}/>
					<Rows row={matrix[13]} width={32 * 10} height={32}/>
					<Rows row={matrix[14]} width={32 * 10} height={32}/>
					<Rows row={matrix[15]} width={32 * 10} height={32}/>
					<Rows row={matrix[16]} width={32 * 10} height={32}/>
					<Rows row={matrix[17]} width={32 * 10} height={32}/>
					<Rows row={matrix[18]} width={32 * 10} height={32}/>
					<Rows row={matrix[19]} width={32 * 10} height={32}/>
				</div>
			</div>
		</div>
	);
}

export default Matrix;