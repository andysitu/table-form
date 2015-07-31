function calculateFromI(y, x, i) { // gives an array [y, x] of new coordinates based on direcion i and old coordinates y, x
	switch(i) {
		case 0: return [y, x - 1]; // left
		case 1: return [y - 1, x]; // up
		case 2: return [y, x + 1]; // right
		case 3: return [y + 1, x]; // down
		default: throw "calculateFromI only takes i from 0-3";
	}
}

function funcCallFourDir(y, x, func) {
	var coord = [0, 0];

	for (var i = 0; i < 4; i++) {
		coord = this.calculateFromI(y, x, i);

		if ( coordValid(coord[0], coord[1]) ) {
			func(coord[0], coord[1]);
		}
	}

}

function coordValid(y, x) {
	if (y >= 0 && y < world.map.length) {
		
		if (x >= 0 && x < world.map[y].length) {
			return true;
		}

	} else {
		return false;
	}
}