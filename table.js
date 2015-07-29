
function init() {
var num = prompt("What width do you want the square table to be?", "Give a number");

makeTable(num);
};

window.onload = init;

function makeTable(num) {
	var table = document.createElement("table");

	var tbody = document.createElement("tbody");

	table.appendChild(tbody);

	for (var i = 0; i < num; i++) {
		tbody.insertRow(i);

		for (var j = 0; j < num; j++) {
			tbody.rows[i].insertCell(j);
			tbody.rows[i].cells[j].id = i + " " + j;
			tbody.rows[i].cells[j].onclick = function() {
				var str = /(\d*) (\d*)/.exec(this.id);
				var y = Number(str[1]); 
				var x = Number(str[2]);

				controller.clicked(y, x, this);
			}
		}
	}

	document.body.appendChild(table);
}

var controller = {
	clicked(y, x, ele) {
		ele.setAttribute("class", "red");
	}
};