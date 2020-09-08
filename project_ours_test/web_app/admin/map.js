//initialize map
let mymap = L.map("map").setView([38.24, 21.73], 12);

const attribution =
	'&copy; <a href="https://www.openstreetpam.org/copyright">OpenStreetMap</a> contributors';
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let tiles = L.tileLayer(url, { attribution });

tiles.addTo(mymap);

//----------------------------------------
//some random placeholder for years
let list = [];
let i = 2015;
while (list.length < 6) {
	list.push(i.toString());
	i += 1;
}

//----------------------------------------
//puts values in dropdowns
function populateDropdown(id, items) {
	let dropdown = document.getElementById(id);
	for (year of items) {
		let btn = document.createElement("button");
		let textNode = document.createTextNode(year);
		btn.appendChild(textNode);
		btn.setAttribute("onclick", "updateLabel(this)");
		btn.classList.add("dropdown-item");
		dropdown.appendChild(btn);
	}
}
//updates when user clicks
function updateLabel(element) {
	element.parentNode.parentNode.childNodes[1].textContent = element.textContent;
	if (!element.parentNode.classList.contains("until")) {
		let group = element.parentNode.parentNode.parentNode;
		let dropdown = group.querySelector("div.until");
		let btns = dropdown.children;
		for (btn of btns) {
			btn.toggleAttribute("disabled", false);
		}
		for (btn of btns) {
			if (btn.textContent == element.textContent) {
				btn.toggleAttribute("disabled", true);
				break;
			}
			btn.toggleAttribute("disabled", true);
		}
	}
}

//single value or range on button groups
function rangeToggle(btn) {
	btn.classList.toggle("active");
	btn.parentNode.childNodes[5].childNodes[1].toggleAttribute("disabled");
}

//put a list of strings on the activities dropdown
function populateActivities(id, items) {
	let dropdown = document.getElementById(id);
	for (activity of items) {
		let btn = document.createElement("button");
		let textNode = document.createTextNode(activity);
		btn.appendChild(textNode);
		btn.setAttribute("onclick", "tick(this)");
		btn.classList.add("dropdown-item");
		dropdown.appendChild(btn);
	}
}

//tick the selected activity
function tick(button) {
	let tick = '<i class="fas fa-check"></i>';
	if (button.classList.contains("ticked")) {
		button.classList.remove("ticked");
		let s = button.textContent;
		button.innerHTML = s;
	} else {
		button.classList.add("ticked");
		button.innerHTML = tick + button.innerHTML;
	}
}

//--------------------------------------------------
populateDropdown("first-year-list", list);
populateDropdown("last-year-list", list);
document.getElementById("last-year").toggleAttribute("disabled");

populateDropdown("first-month-list", [
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
]);
populateDropdown("last-month-list", [
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
]);
document.getElementById("last-month").toggleAttribute("disabled");

populateDropdown("first-day-list", [
	"MON",
	"TUE",
	"WED",
	"THU",
	"FRI",
	"SAT",
	"SUN"
]);
populateDropdown("last-day-list", [
	"MON",
	"TUE",
	"WED",
	"THU",
	"FRI",
	"SAT",
	"SUN"
]);
document.getElementById("last-day").toggleAttribute("disabled");

populateDropdown("first-hour-list", [
	0,
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
	23
]);
populateDropdown("last-hour-list", [
	0,
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
	23
]);

document.getElementById("last-hour").toggleAttribute("disabled");
getActivities();
//--------------------------------------------------

//create a json object with the selected user options
function getJSON() {
	let yearStart = document
		.getElementById("first-year")
		.textContent.replace(/\t|\n/g, "");
	let yearEnd = document.getElementById("last-year");
	if (yearEnd.hasAttribute("disabled")) {
		yearEnd = yearStart;
	} else {
		yearEnd = yearEnd.textContent.replace(/\t|\n/g, "");
    }
    
	let monthStart = document
		.getElementById("first-month")
		.textContent.replace(/\t|\n/g, "");
	let monthEnd = document.getElementById("last-month");
	if (monthEnd.hasAttribute("disabled")) {
		monthEnd = monthStart;
	} else {
		monthEnd = monthEnd.textContent.replace(/\t|\n/g, "");
    }    
    
	let dayStart = document
		.getElementById("first-day")
		.textContent.replace(/\t|\n/g, "");
	let dayEnd = document.getElementById("last-day");
	if (dayEnd.hasAttribute("disabled")) {
		dayEnd = dayStart;
	} else {
		dayEnd = dayEnd.textContent.replace(/\t|\n/g, "");
    }    

    
	let hourStart = document
		.getElementById("first-hour")
		.textContent.replace(/\t|\n/g, "");
	let hourEnd = document.getElementById("last-hour");
	if (hourEnd.hasAttribute("disabled")) {
		hourEnd = hourStart;
	} else {
		hourEnd = hourEnd.textContent.replace(/\t|\n/g, "");
	}

    let yearAll = false;
	if (document.getElementById("year-all").classList.contains("btn-warning")) {
		yearAll = true;
	}
    let monthAll = false;
    //monthStart = month2num(monthStart);
    //monthEnd = month2num(monthEnd);
	if (document.getElementById("month-all").classList.contains("btn-warning")) {
		monthAll = true;
	}
    let dayAll = false;
    //dayStart = day2num(dayStart);
    //dayEnd = day2num(dayEnd);
	if (document.getElementById("day-all").classList.contains("btn-warning")) {
		dayAll = true;
	}
	let hourAll = false;
	if (document.getElementById("hour-all").classList.contains("btn-warning")) {
		hourAll = true;
    }
    
    
    if(!dayAll){
        dayStart = day2num(dayStart);
        dayEnd = day2num(dayEnd);
    }

    if(!monthAll){
        monthStart = month2num(monthStart);
        monthEnd = month2num(monthEnd);
    }

    let actList = [];
	let list = document.getElementById("activities-list").children;
	for (item of list) {
		if (item.classList.contains("ticked")) {
			actList.push(item.textContent);
		}
	}
    

    
	obj =  {
		yearAll: yearAll,
		monthAll: monthAll,
		dayAll: dayAll,
		hourAll: hourAll,
		yearStart: yearStart,
		yearEnd: yearEnd,
		monthStart: monthStart,
		monthEnd: monthEnd,
		dayStart: dayStart,
		dayEnd: dayEnd,
		hourStart: hourStart,
		hourEnd: hourEnd,
		actList: actList
    };

    return obj
    
}

function day2num(day) {
	switch (day) {
		case "MON":
			return 1;
			break;
		case "TUE":
			return 2;
			break;
		case "WED":
			return 3;
			break;
		case "THU":
			return 4;
			break;
		case "FRI":
			return 5;
			break;
		case "SAT":
			return 6;
			break;
		case "SUN":
			return 7;
			break;
	}
}

function month2num(month) {
	switch (month) {
		case "JAN":
			return 1;
			break;
		case "FEB":
			return 2;
			break;
		case "MAR":
			return 3;
			break;
		case "APR":
			return 4;
			break;
		case "MAY":
			return 5;
			break;
		case "JUN":
			return 6;
			break;
		case "JUL":
			return 7;
			break;
		case "AUG":
			return 8;
			break;
		case "SEP":
			return 9;
			break;
		case "OCT":
			return 10;
			break;
		case "NOV":
			return 11;
			break;
		case "DEC":
			return 12;
			break;
	}
}

//================================================================================

function checkIfSelected(json) {
	let values = Object.values(json);
	if (
		((values.indexOf("First Year") !== -1 ||
			values.indexOf("Last Year") !== -1) &&
			!json.yearAll) ||
		((values.indexOf("First Month") !== -1 ||
			values.indexOf("Last Month") !== -1) &&
			!json.monthAll) ||
		((values.indexOf("First Day") !== -1 ||
			values.indexOf("Last Day") !== -1) &&
			!json.dayAll) ||
		((values.indexOf("First Hour") !== -1 ||
			values.indexOf("Last Hour") !== -1) &&
			!json.hourAll) ||
		json.actList == []
	) {
		return false;
	} else {
		return true;
	}
}
//================================================================================

var cfg = {
	radius: 30,
	maxOpacity: 0.7,
	scaleRadius: false,
	useLocalExtrema: false,
	latField: "lat",
	lngField: "lng",
	valueField: "count"
};

//fetch the activities from server
function getActivities() {
	fetch("http://localhost:80/project_ours_test/backend/acts.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" }
	})
		.then(res => res.json())
		.then(res => {
			populateActivities("activities-list", res.acts);
		})
		.catch(res => console.log(res));
}

function drawHeatMap(map) {
	if (!checkIfSelected(getJSON())) {
		alert("Check all fields");
	} else {
		if (map.heatmap) {
			map.remove(heatmap);
			return;
		}
		fetch("http://localhost:80/project_ours_test/backend/map.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(getJSON())
		})
			.then(res => res.json())
			.then(res => {
				let coords = [];
				for (i of res.locations) {
					pair = {
						lat: i.latitudeE7 / 10000000,
						lng: i.longitudeE7 / 10000000,
						count: 1
					};
					coords.push(pair);
				}
				let data = { max: 10, data: coords };

				let heatmap = new HeatmapOverlay(cfg);
				map.addLayer(heatmap);
				heatmap.setData(data);
			});
	}
}
let format = "";

function setDownSel(btn) {
	btns = document.getElementById("format-select").children[0].children;
	for (i = 0; i < 3; i++) {
		btns[i].classList.remove("btn-warning");
		if (btns[i].isSameNode(btn)) {
			btn.classList.add("btn-warning");
			format = btn.textContent.toLowerCase();
		}
	}
}

function downloadFile() {
	if (!checkIfSelected(getJSON())) {
		alert("Check all fields");
	} else {
	}
	if (format == "") {
		alert("pick a format");
	} else {
		fetch(
			"http://localhost:80/project_ours_test/backend/extract_" +
				format +
				".php",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(getJSON()),
				responseType: "blob"
			}
		)
			.then(res => res.blob())
			.then(res => {
				download(res, "file." + format);
			});
	}
}

let test = () =>
	fetch("http://localhost:80/project_ours_test/backend/map.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(getJSON())
	})
		.then(res => res.json())
		.then(res => console.log(res));
