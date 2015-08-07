var world = {
	map: [],
	totalCells: 0,
	filledCells: 0,

	effect(y, x, colorValue) { // sets tiles around clicked cell into different shades of color
		if ( coordValid(y, x) ) {
			if (colorValue === 'g' && this.map[y][x] >= 0) {
				world.setArea(y, x, colorValue);

				return true;
			} else if (colorValue === 'r' && this.map[y][x] <= 0) {
				world.setArea(y, x, colorValue);

				return true;
			}

			return false;
		} else {
			return false;
		}
	},

	setArea(y, x, colorValue) {
		var ele = document.getElementById(y + "_" + x);

		var color = '';

		if (colorValue === 'g') {
			value = 1;
			color = 'green';
			ele.style.background = "rgba(0, 155, 0, 1)";
		} else {			// red
			value = -1;
			color = 'red';
			ele.style.background = "rgba(255, 0, 0, 1)";
		}

		this.map[y][x] = colorValue;

		funcCallFourDir(y, x, function(y1, x1) {
			world.setColor(y1, x1, 0.80 * value);
		}, false, 1);
		funcCallFourDir(y, x, function(y1, x1) {
			world.setColor(y1, x1, 0.55 * value);
		}, false, 2);
		funcCallFourDir(y, x, function(y1, x1) {
			world.setColor(y1, x1, 0.35 * value);
		}, false, 3);
		funcCallFourDir(y, x, function(y1, x1) {
			world.setColor(y1, x1, 0.15 * value);
		}, false, 4);

		calculateXY(y, x, 1, 1, function(y1, x1) {
			world.setColor(y1, x1, 0.70 * value);
		});
		calculateXY(y, x, 2, 1, function(y1, x1) {
			world.setColor(y1, x1, 0.45 * value);
		});
		calculateXY(y, x, 1, 2, function(y1, x1) {
			world.setColor(y1, x1, 0.45 * value);
		});
		calculateXY(y, x, 3, 1, function(y1, x1) {
			world.setColor(y1, x1, 0.25 * value);
		});
		calculateXY(y, x, 1, 3, function(y1, x1) {
			world.setColor(y1, x1, 0.25 * value);
		});
		calculateXY(y, x, 2, 2, function(y1, x1) {
			world.setColor(y1, x1, 0.30 * value);
		});
	},

	setColor(y, x, value) {
		if (world.map[y][x] !== 'g' && world.map[y][x] !== 'r') {
			var ele = document.getElementById(y + "_" + x);

			world.map[y][x] += value;

			if (world.map[y][x] > 0) {
				if (world.map[y][x] > 0.9) {
					ele.style.background = "rgba(0, 155, 0, 0.9)";
				} else {
					ele.style.background = "rgba(0, 155, 0, " + world.map[y][x] + ")";
				}
			} else if (world.map[y][x] < 0) {
				if (world.map[y][x] < -0.85) {
					ele.style.background = "rgba(255, 0, 0, 0.85)";
				} else {
					ele.style.background = "rgba(255, 0, 0, " + -world.map[y][x] + ")";
				}
			} else {
				ele.style.background = "";
			}

			if (world.map[y][x] !== 0) {
				world.filledCells++;
			} else {
				world.filledCells--;
			}
		}
	},

	endGame() {
		if (this.filledCells === this.totalCells) {
			return this.countValues();
		} else {
			return false;
		}
	},

	countValues() {
		var cell = null, totalValue = 0;

		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				cell = world.map[i][j];
				
				if (cell === 'g') {
					totalValue += 1;
				} else if (cell === 'r') {
					totalValue -= 1;
				} else {
					totalValue += cell;
				}
			}
		}

		return Number(totalValue.toFixed(2));
	},

	makeAllColor(color) {
		var cell = null;

		for (var i = 0; i < world.map.length; i++) {
			for (var j = 0; j< world.map[i].length; j++) {
				cell = document.getElementById(i + "_" + j);

				cell.style.background = color;
			}
		}
	}
};


var controller = {
	turn: "g",
	switchTurn() {
		if (this.turn === 'g') {
			this.turn = 'r';
		} else if (this.turn === 'r') {
			this.turn = 'g';
		} else {
			throw("Error in controller.switchTurn " + this.turn);
		}
	},

	clicked(y, x) {
		var ele = document.getElementById(y + "_" + x);

		if ( world.effect(y, x, this.turn) ) { // returns true if clicked was on empty space
			var value = world.endGame();

			if (value !== false && this.turn === 'r') {
				if (value > 0) {
					world.makeAllColor("green");
					this.stopClicky();
				} else if (value < 0) {
					world.makeAllColor("red");
					this.stopClicky();
				}

			}

			this.switchTurn();
		}
	},

	stopClicky: null
};

function init() {
	var cols = Math.floor((window.innerWidth / 9) );
	var rows = Math.floor(window.innerHeight / 9 - 2);

	makeTable(rows, cols);

	var table = document.getElementById("table");

	function clicky(event) {
		var target = event.target;

		var str = /(\d*)_(\d*)/.exec(target.id);
		if (str) {
			var y = Number(str[1]); 
			var x = Number(str[2]);

			controller.clicked(y, x);
		}
	}

	table.addEventListener("click", clicky, false)

	table = null;

	controller.stopClicky = function() {
		var table = document.getElementById("table");
		table.removeEventListener("click", clicky, false);
	}
};

window.onload = init;