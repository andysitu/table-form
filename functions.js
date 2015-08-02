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
			tbody.rows[i].cells[j].onclick = function(e) {
				var str = /(\d*)_(\d*)/.exec(this.id);
				var y = Number(str[1]); 
				var x = Number(str[2]);

				controller.master("clicked", y, x);
			}
		}
	}

	document.body.appendChild(table);
	table = null;
	tbody = null;
}

function makeDisplay() {
	var table = document.getElementById("table");

	var rightValue = table.getBoundingClientRect().right;
	rightValue += 10;

	var disp = document.createElement("div");
	
	document.body.appendChild(disp);

	disp.id = "msg";

	var sheet = document.styleSheets[0];

	var string = "#msg {position: absolute;top: 10px; left: " + rightValue +"px; background-color: red }"

	sheet.insertRule(string, 0);


	table = null;
	right = null;
	disp = null;
}

function calculateFromI(y, x, i) { // gives an array [y, x] of new coordinates based on direcion i and old coordinates y, x
	switch(i) {
		case 0: return [y, x - 1]; // left
		case 1: return [y - 1, x]; // up
		case 2: return [y, x + 1]; // right
		case 3: return [y + 1, x]; // down
		default: throw "calculateFromI only takes i from 0-3, not " + i;
	}
}

function funcCallFourDir(y, x, func, status) { // if sttus === true, then it'll also do function on y,x (original coordinate)
	var coord = [0, 0];

	for (var i = 0; i < 4; i++) {
		coord = this.calculateFromI(y, x, i);

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

		return cell.innerHTML;

	} else {
		throw("Invalid coordinates for getMapValue: " + y + " " + x);
	}
}

function setMapValue(y, x, value) {
	if ( coordValid(y, x) ) {
		var oldValue = getMapValue(y, x);

		var cell = document.getElementById(y + "_" + x);

		if (value !== oldValue) {
			cell.innerHTML = value;
		}


	} else {
		throw("Invalid coordinates for setMapValue: " + y + " " + x);
	}
}