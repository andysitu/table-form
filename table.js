var world = {
	map: [],

	classTranslator(value) { // give it a letter (ex: "r") to get back the right color/ class ("red"). Also, can work in reverse
		if (value.length <= 1) {
			switch(value) {
				case "r": return "red";
				case "g": return "green";
				default: console.log("classTranslator: " + value);
						 throw("Unknown value given to classTranslator");
			}
		} else {
			switch(value) {
				case "red": return "r";
				case "green": return "g";
				default: console.log("classTranslator: " + value);
						 throw("Unknown value given to classTranslator");
			}
		}
	},
	changeMap(y, x, colorValue) { // Changes the value in map array and appends the corresponding class in the table-cell
		this.map[y][x] = colorValue;

		var ele = document.getElementById(y + " " + x);
		ele.className = this.classTranslator(colorValue);
	}
};

function init() {
	var cols = Math.floor((window.innerWidth / 7) * 0.80);
	var rows = Math.floor(window.innerHeight / 7 - 2);

	makeTable(rows, cols);
};

window.onload = init;

function makeTable(rows, cols) {
	var table = document.createElement("table");

	var tbody = document.createElement("tbody");

	table.appendChild(tbody);

	for (var i = 0; i < rows; i++) {
		tbody.insertRow(i);
		world.map[i] = new Array();

		for (var j = 0; j <	 cols; j++) {
			world.map[i][j] = "";

			tbody.rows[i].insertCell(j);
			tbody.rows[i].cells[j].id = i + " " + j;
			tbody.rows[i].cells[j].onclick = function(e) {
				var str = /(\d*) (\d*)/.exec(this.id);
				var y = Number(str[1]); 
				var x = Number(str[2]);

				controller.clicked(y, x);
			}
		}
	}

	document.body.appendChild(table);
}

var controller = {
	clicked(y, x) {
		var ele = document.getElementById(y + " " + x);
		ele.setAttribute("class", "green");
		this.response(y, x);
	},

	response(y, x) {
		var ele = document.getElementById(y - 1 + " " + x);
		if (ele) {
			ele.className = "red";
		}
	},

	calculateFromI(y, x, i) { // gives an array [y, x] of new coordinates based on direcion i and old coordinates y, x
		switch(i) {
			case 0: return [y, x - 1]; // left
			case 1: return [y - 1, x]; // up
			case 2: return [y, x + 1]; // right
			case 3: return [y + 1, x]; // down
			default: throw "calculateFromI only takes i from 0-3";
		}
	},

	setColor(y, x, color) {
		var ele = document.getElementById(y + " " + x);

		if (ele) {

		}
	}
};
