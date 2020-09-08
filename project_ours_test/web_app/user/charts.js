Chart.defaults.global.defaultFontColor = "white";
let colors = [];

let j = 0;
while (j < 30) {
	colors.push(
		"#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
	);
	j++;
}

function range(int) {
	let r = Array(int);
	let k = 0;
	while (k < int) {
		r[k] = k;
		k += 1;
	}
	return r;
}


//DEFINING THE CHARTS--------------------------------------------------

let pie;
let bar;
let line;

function drawPieChart(colors, data, labels, id) {
	let ctx = document.getElementById(id);

	pie = new Chart(ctx, {
		type: "pie",
		data: {
			labels: labels,
			datasets: [
				{
					label: "number of records",
					data: data,
					backgroundColor: colors,
					borderWidth: 0
				}
			]
		},
		options: {
			title: {
				display: true,
				text: "Activities distribution",
				fontSize: 30
			}
		}
	});
}

let ctx = document.getElementById("day-bar");

bar = new Chart(ctx, {
	type: "bar",
	data: {
		labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
		datasets: [
			{
				data: [],
				backgroundColor: "DeepPink"
			}
		]
	},
	options: {
		legend: {
			display: false
		},
		title: {
			display: true,
			text: "Daily",
			fontSize: 30
		},
		scales: {
			xAxes: [
				{
					gridLines: { color: "#cccfff", lineWidth: 0.5 }
				}
			],
			yAxes: [
				{
					ticks: { beginAtZero: true },
					gridLines: { color: "#cccfff", lineWidth: 0.5 }
				}
			]
		}
	}
});

ctx = document.getElementById("hour-line");

line = new Chart(ctx, {
	type: "line",
	data: {
		labels: range(24),
		datasets: [
			{
				label: "Hourly",
				fill: false,
				data: [],
				borderColor: "DeepPink"
			}
		]
	},
	options: {
		title: {
			display: true,
			text: "Hourly",
			fontSize: 30
		},
		scales: {
			xAxes: [
				{
					gridLines: { color: "#cccfff", lineWidth: 0.5 }
				}
			],
			yAxes: [
				{
					ticks: { beginAtZero: true },
					gridLines: { color: "#cccfff", lineWidth: 0.5 }
				}
			]
		}
	}
});

//--------------------------------------------------------------------------------

let test_user_3 = () =>
	fetch("http://localhost:80/project_ours_test/backend/charts.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type: "hourT" })
	})
		.then(res => res.json())
		.then(res => console.log(res));

async function fetchBarChart(activity) {
	let data = await fetch(
		"http://localhost:80/project_ours_test/backend/charts.php",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: "dayT" })
		}
	)
		.then(res => res.json())
		.then(res => {
			return res[activity];
		})
		.then(res => {
			arr = Array(7);
			for (i = 0; i < 7; i++) {
				arr[i] = res[i] == undefined ? 0 : res[i];
			}
			return arr;
		});
	return data;
}

async function fetchLineChart(activity) {
	let ind = range(24);
	let data = await fetch(
		"http://localhost:80/project_ours_test/backend/charts.php",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: "hourT" })
		}
	)
		.then(res => res.json())
		.then(res => {
			return res[activity];
		})
		.then(res => {
			let arr = Array(24);
			for (i = 0; i <= 23; i++) {
				arr[i] = res[i] == undefined ? 0 : res[i];
			}

			return arr;
		});
	return data;
}

function fetchAndPieChart() {
    //the fetch is returning a json that is obtaining the number of records for each activity
	fetch("http://localhost:80/project_ours_test/backend/charts.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ type: "pie" })
	})
		.then(res => res.json())
		.then(res => {
            //adding activity buttons as a dropdown list------------------------------
			drawPieChart(colors, Object.values(res), Object.keys(res), "pie-chart");
			let dropdown = document.getElementById("act-list");
			for (year of Object.keys(res)) {
				let btn = document.createElement("button");
				let textNode = document.createTextNode(year);
                btn.appendChild(textNode);
                //on click to an activity the charts are updated for the corresponding activity 
				btn.addEventListener("click", drawCharts);
				btn.classList.add("dropdown-item");
                dropdown.appendChild(btn);    
            }
            //-------------------------------------------------------------------------
		});
}

function drawCharts(event) {
	fetchLineChart(event.target.textContent).then(res => {
		console.log(res);
		line.data.datasets[0].data = res;
		line.update();
	});

	fetchBarChart(event.target.textContent).then(res => {
		console.log(res);
		bar.data.datasets[0].data = res;
		bar.update();
	});
}

fetchAndPieChart();

fetchLineChart("ON_FOOT").then(res => {
	line.data.datasets[0].data = res;
	line.update();
});

fetchBarChart("ON_FOOT").then(res => {
	bar.data.datasets[0].data = res;
	bar.update();
});
