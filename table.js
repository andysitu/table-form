var world = {
	map: [],
	playerLoc: [0,0],

	classTranslator(value) { // give it a letter (ex: "r") to get back the right color/ class ("red"). Also, can work in reverse
		if (value.length <= 1) {
			switch(value) { // NOTE: ALSO UPDATE ELSE CASE AND VALUETRANSLATOR
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
		if ( coordValid(y, x) ) {
			if (this.map[y][x] === " ") {
				this.map[y][x] = colorValue;

				var ele = document.getElementById(y + "_" + x);
				ele.className = this.classTranslator(colorValue);

				return true;
			}
		} else {
			return false;
		}

	},

	calculate(y, x) { // will calculate the points of that current position for either player or computer
		var sum = 0;

		funcCallFourDir(y, x, function(y1, x1) {
			sum += world.valueTranslator(y1, x1);
		})

		sum += world.valueTranslator(y, x);

		return sum;
	},

	valueTranslator(y, x) {
		switch(world.map[y][x]) {
			case "r": return -1;
			case "g": return 1;
			case " ": return 0;
			default: throw("Error in valueTranslator " + map[y][x]);
		}	
	}


};

var blocks = {
	controller(y, x) { // handles what to do with destroying blocks, etc depending on their values.
		
		funcCallFourDir(y, x, function(y1, x1) {
			if (world.valueTranslator(y1, x1) >= 1) {
				var value = world.calculate(y1, x1);

				setMapValue(y1, x1, value);
			}
		}, true ); // true so that controller also acts on y, x
	}
}

function init() {
	var cols = Math.floor((window.innerWidth / 8) * 0.80);
	var rows = Math.floor(window.innerHeight / 8 - 2);

	makeTable(rows, cols);

	controller.master("player")
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
}

var controller = {
	master(status, y, x) {
		if (status === "clicked") {
			this.clicked(y,x);
			window.setTimeout(timedOutResponse, 50, y, x);

			function timedOutResponse(y, x) {
				controller.response(y, x);
				blocks.controller(y,x);
			}
		} else if (status === "player") {

		}
	},

	clicked(y, x) {
		var ele = document.getElementById(y + "_" + x);

		world.changeMap(y, x, "g") // appends "g" onto the map where player clicked

	},

	response(y, x) {
		var dirCount = {0: 0, 1: 0, 2: 0, 3: 0}; 

		while (dirCount[1] <= 0 || dirCount[2] <= 0 || dirCount[3] <= 0 || dirCount[4] <= 0) {
			var dir = Math.floor( Math.random() * 4 );
			dirCount[dir]++;

			var coord = calculateFromI(y, x, dir);

			var bool = world.changeMap(coord[0], coord[1], "r");

			if ( bool ) {
				return true;
			}
		}

		var count = 0, max = world.map.length * world.map[0].length;
		while ( count < max) {
			y = Math.floor(Math.random() * world.map.length);
			x = Math.floor(Math.random() * world.map[y].length);

			var bool = world.changeMap(y, x, "r");

			if ( bool ) {
				return true;
			}
		}


		return false;
	},

	setColor(y, x, color) {
		var ele = document.getElementById(y + "_" + x);

		if (ele) {

		}
	}
};
