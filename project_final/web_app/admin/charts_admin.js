//we defining the color for the chart's text to be white
Chart.defaults.global.defaultFontColor = "white";

let colors = [];

//every time the script executes we get another array of color in order to fill in the activity types for the pie chart
let i = 0;
while (i < 30) {
	colors.push(
		"#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
	);
	i++;
}


//creating an array of number of int parameter elements
function range(int) {
	let r = Array(int);
	let k = 0;
	while (k < int) {
		r[k] = k + 1;
		k += 1;
	}
	return r;
}

//--------------------------------------------------

//we define functions for each one of the charts that we will draw to our page
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
				text: "Activity Distribution",
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
					backgroundColor: "LightBlue"
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
					borderColor: "LightBlue"
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

//this is an asyncronous function in wich we get all the apropriate data that we need to draw all the charts
async function getData() {
	//the response of the fetch is a json that contains all the apropriate data that we need for the charts..
	let data = await fetch(
		"http://localhost:80/project_final/backend/charts_admin.php",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
		}
	)
		.then(res => {
			return res.json();
		})
		.then(data => {
			return data;
		})
		.catch(res => console.log("FAIL"));

	//---------------------------------------------------------------------------------------	
	console.log(data);

	let activityData = data.Activity_Records;
	console.log(activityData); 
	let pieLabels = Object.keys(activityData);
	
	for (var i = 0; i < pieLabels.length; i++){
		if(pieLabels[i] == ""){
			pieLabels[i] = "NULL";
		}
	}
	
	console.log(pieLabels);
	
	let pieData = Object.values(activityData);
	//console.log(pieData);

	let userData = {
		users: Object.keys(data.User_Records),
		count: Object.values(data.User_Records)
	}; //
	console.log(userData);

	let yearData = {
		years: Object.keys(data.Year_Records),
		count: Object.values(data.Year_Records)
	}; //
	console.log(yearData);

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

	drawBarChart(userData.count, userData.users, "usersBar", "User Activity Distribution");

	drawBarChart(
		dayData,
		["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
		"dayBar",
		"Daily Activity Distribution"
	);

	drawBarChart(yearData.count, yearData.years, "yearBar", "Year Activity Distribution");
	
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
		"Month Activity Distribution"
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
		"Hour Activity Distribution"
	);
}

getData();
