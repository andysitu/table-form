function makeTable(rows, cols) {
	var table = document.createElement("table");

	table.id = "table";

	var tbody = document.createElement("tbody");

	table.appendChild(tbody);

	for (var i = 0; i < rows; i++) {
		tbody.insertRow(i);
		world.map[i] = new Array();

		for (var j = 0; j <	 cols; j++) {
			world.map[i][j] = " ";

			tbody.rows[i].insertCell(j);
			tbody.rows[i].cells[j].id = i + "_" + j;
		}
	}
	
	world.totalCells = i * j;

	document.body.appendChild(table);
	table = null;
	tbody = null;
}

function calculateFromI(y, x, i, distance) { // gives an array [y, x] of new coordinates based on direcion i and old coordinates y, x
	if (distance === undefined) {
		distance = 1;
	}

	switch(i) {
		case 0: return [y, x - distance]; // left
		case 1: return [y - distance, x]; // up
		case 2: return [y, x + distance]; // right
		case 3: return [y + distance, x]; // down
		default: throw "calculateFromI only takes i from 0-3, not " + i;
	}
}

function calculateXY(y, x, y1, x1, func) {
	var y2 = 0, x2 = 0;

	y2 = y - y1;
	x2 = x - x1;
	if (coordValid(y2, x2)) {
		func(y2, x2);
	}

	y2 = y + y1;
	x2 = x - x1;
	if (coordValid(y2, x2)) {
		func(y2, x2);
	}

	y2 = y - y1;
	x2 = x + x1;
	if (coordValid(y2, x2)) {
		func(y2, x2);
	}

	y2 = y + y1;
	x2 = x + x1;
	if (coordValid(y2, x2)) {
		func(y2, x2);
	}
}

function funcCallFourDir(y, x, func, status, distance) { // if sttus === true, then it'll also do function on y,x (original coordinate)
	var coord = [0, 0];

	for (var i = 0; i < 4; i++) {
		coord = this.calculateFromI(y, x, i, distance);

		if ( coordValid(coord[0], coord[1]) ) {
			func(coord[0], coord[1], i);
		}
	}

	if (status === true) {
		func(y, x);
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

function getMapValue(y, x) {
	if ( coordValid(y, x) ) {

		var cell = document.getElementById(y + "_" + x);

		return (cell.innerHTML || 0);

	} else {
		throw("Invalid coordinates for getMapValue: " + y + " " + x);
	}
}

function setMapValue(y, x, value) {
	if ( coordValid(y, x) ) {
		var oldValue = getMapValue(y, x);

		var cell = document.getElementById(y + "_" + x);

		var difference = value - oldValue;

		if (value < 0) {
			world.map[y][x] = " ";

			var ele = document.getElementById(y + "_" + x);
			ele.innerHTML = "";
			ele = null;

			controller.calculator(y, x);

		} else if (value !== oldValue) {
			cell.innerHTML = value;
		}

	} else {
		throw("Invalid coordinates for setMapValue: " + y + " " + x);
	}
}

function keyToDir(e) { // translates e.keyCode to return a string of the direction
		if (e.keyCode == 37) {
			return 0;
		} else if (e.keyCode == 38) {
			return 1;
		} else if (e.keyCode == 39) {
			return 2;
		} else if (e.keyCode == 40) {
			return 3;
		} else {
			return false;
		}
}