Chart.defaults.global.defaultFontColor = "white";
let colors = [];

let i = 0;
while (i < 30) {
	colors.push(
		"#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
	);
	i++;
}

function range(int) {
	let r = Array(int);
	let k = 0;
	while (k < int) {
		r[k] = k + 1;
		k += 1;
	}
	return r;
}

let dummy = { test: "test" };

//--------------------------------------------------

function drawPieChart(colors, data, labels, id) {
	let ctx = document.getElementById(id);

	let pie = new Chart(ctx, {
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

function drawBarChart(data, labels, id, text) {
	let ctx = document.getElementById(id);

	let pie = new Chart(ctx, {
		type: "bar",
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
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
				text: text,
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
}

function drawLineChart(data, labels, id, text) {
	let ctx = document.getElementById(id);

	let pie = new Chart(ctx, {
		type: "line",
		data: {
			labels: labels,
			datasets: [
				{
					label: "Continous " + text,
					fill: false,
					data: data,
					borderColor: "DeepPink"
				}
			]
		},
		options: {
			title: {
				display: true,
				text: text,
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
}

//--------------------------------------------------

!(async function getData() {
	let data = await fetch(
		"http://localhost:80/project_ours_test/backend/charts_admin.php",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(dummy)
		}
	)
		.then(res => {
			return res.json();
		})
		.then(data => {
			return data;
		})
		.catch(res => console.log("FAIL"));

	console.log(data);

	let activityData = data.Activity_Records; //
	let pieLabels = Object.keys(activityData);
	let pieData = Object.values(activityData);
	let userData = {
		users: Object.keys(data.User_Records),
		count: Object.values(data.User_Records)
	}; //
	let yearData = {
		years: Object.keys(data.Year_Records),
		count: Object.values(data.Year_Records)
	}; //

	let monthData = range(12).map(x =>
		data.Month_Records[x] == undefined ? 0 : data.Month_Records[x]
	);
	console.log(monthData);
	let dayData = range(7).map(x =>
		data.Day_Records[x] == undefined ? 0 : data.Day_Records[x]
	);
	console.log(dayData);
	hourData = Object.values(data.Hour_Records);
	console.log(hourData);
	drawPieChart(
		colors.slice(0, pieLabels.length),
		pieData,
		pieLabels,
		"activitiesPie"
	);
	drawBarChart(userData.count, userData.users, "usersBar", "User Distribution");
	drawBarChart(
		dayData,
		["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
		"dayBar",
		"Day Distribution"
	);
	drawBarChart(yearData.count, yearData.years, "yearBar", "Year Distribution");
	drawLineChart(
		monthData,
		[
			"JAN",
			"FEB",
			"MAR",
			"APR",
			"MAY",
			"JUN",
			"JUL",
			"AUG",
			"SEP",
			"OCT",
			"NOV",
			"DEC"
		],
		"monthLine",
		"Month Distribution"
	);
	drawLineChart(
		hourData,
		[
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24
		],
		"hourLine",
		"Hour Distribution"
	);
})();
