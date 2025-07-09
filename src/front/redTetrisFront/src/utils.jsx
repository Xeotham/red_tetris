export const   getTexture = (type) => {
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
		default: 	    return '/src/assets/textures/minimalist/empty.png';
	}
}
