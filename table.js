
function init() {
	var cols = Math.floor((window.innerWidth / 7) * 0.80);
	var rows = Math.floor(window.innerHeight / 7 - 4);

	makeTable(rows, cols);
};

window.onload = init;

function makeTable(rows, cols) {
	var table = document.createElement("table");

	var tbody = document.createElement("tbody");

	table.appendChild(tbody);

	for (var i = 0; i <= rows; i++) {
		tbody.insertRow(i);

		for (var j = 0; j <= cols; j++) {
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
	}
};