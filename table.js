var world = {
	map: [],
	totalCells: 0,
	filledCells: 0,
	playerLoc: [1,1],
	setPLoc(y, x) {
		if (coordValid(y, x)) {
			this.playerLoc = [y, x];
		}
	},

	effect(y, x, colorValue) { // sets tiles around clicked cell into different shades of color
		if ( coordValid(y, x) ) {
			if (this.map[y][x] !== 'g' && this.map[y][x] !== 'r') {
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
					world.setColor(y1, x1, 0.78 * value);
				}, false, 1);
				funcCallFourDir(y, x, function(y1, x1) {
					world.setColor(y1, x1, 0.55 * value);
				}, false, 2);
				funcCallFourDir(y, x, function(y1, x1) {
					world.setColor(y1, x1, 0.33 * value);
				}, false, 3);

				calculateXY(y, x, 1, 1, function(y1, x1) {
					world.setColor(y1, x1, 0.71 * value);
				});
				calculateXY(y, x, 2, 1, function(y1, x1) {
					world.setColor(y1, x1, 0.46 * value);
				});
				calculateXY(y, x, 1, 2, function(y1, x1) {
					world.setColor(y1, x1, 0.46 * value);
				});

				return true;
			}

			return false;
		} else {
			return false;
		}
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
				if (world.map[y][x] < -0.9) {
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

	calculate(y, x) { // will calculate the points of that current position
							 // color is for theoretical calculation if something were placed there
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
			default: throw("Error in valueTranslator " + this.map[y][x]);
		}	
	},

	endGame() {
		if (this.filledCells === this.totalCells) {
			this.countValues();
			return true;
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

	master(status, y, x) {
		if (status === "clicked") {
			this.clicked(y,x);
		}
	},

	clicked(y, x) {
		var ele = document.getElementById(y + "_" + x);

		if ( world.effect(y, x, this.turn) ) { // returns true if clicked was ' '
			this.switchTurn();
		}
	},

	calculator(y, x) { // handles what to do with destroying blocks, etc depending on their values.
		
		funcCallFourDir(y, x, function(y1, x1) {
			if (world.valueTranslator(y1, x1) > 0) {
				var value = world.calculate(y1, x1);

				setMapValue(y1, x1, value);
				
			} else if (world.valueTranslator(y1, x1) < 0) {
				var value = world.calculate(y1, x1);

				setMapValue(y1, x1, -value);
			}
		}, true ); // true so that controller also acts on y, x
	}
};

function init() {
	var cols = Math.floor((window.innerWidth / 10) );
	var rows = Math.floor(window.innerHeight / 10 - 2);

	makeTable(rows, cols);
/*
	document.onkeydown = function(e) {
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			var i = keyToDir(e);

			var pLoc = world.playerLoc;
			var coord = calculateFromI( pLoc[0], pLoc[1], i);
			pLoc = [coord[0], coord[1]];

			controller.master( "clicked", pLoc[0], pLoc[1]);
		}
	}
*/
	var table = document.getElementById("table");

	function clicky(event) {
		var target = event.target;

		var str = /(\d*)_(\d*)/.exec(target.id);
		if (str) {
			var y = Number(str[1]); 
			var x = Number(str[2]);

			controller.master("clicked", y, x);
		}
	}

	table.addEventListener("click", clicky, false)
};

window.onload = init;