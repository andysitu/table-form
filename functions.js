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

	var leftValue = table.getBoundingClientRect().right;
	leftValue += 10;

	var width = document.body.scrollWidth;
	width -= (leftValue + 15);

	var height = table.getBoundingClientRect().bottom - table.getBoundingClientRect().top - 10;

	var disp = document.createElement("textarea");

	disp.id = "msg";
	disp.wrap = "hard"
	
	document.body.appendChild(disp);

	var sheet = document.styleSheets[0];

	var string = "#msg {position: absolute;top: 10px; left: " + leftValue +"px; width: " + width + "px; height: " + height + "px; }"

	sheet.insertRule(string, 0);

	table = null;
	right = null;
	disp = null;
	
	}

function display(msg) {
	var disp = document.getElementById("msg");

	disp.value = msg;
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
			ele.className = "";	
			ele.innerHTML = "";
			ele = null;

			green.profit -= oldValue;	

		} else if (value !== oldValue) {
			cell.innerHTML = value;
			green.profit += difference;	
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