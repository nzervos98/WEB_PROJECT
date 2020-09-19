
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
//FUNCTIONS FOR DROPDOWNS--------------------------------------------------------------------------
//puts values in dropdowns
function populateDropdown(id, items) {
	let dropdown = document.getElementById(id);
	//for each item (item can be a list of : years , months , days , hours ) we create a corresponding button element for the dropdown list (parent element)
	for (item of items) {
		let btn = document.createElement("button");
		let textNode = document.createTextNode(item);
		btn.appendChild(textNode);
		btn.setAttribute("onclick", "updateLabel(this)");
		btn.classList.add("dropdown-item");
		dropdown.appendChild(btn);
	}
}
//updates when user clicks an element from the dropdown 
function updateLabel(element) {
	element.parentNode.parentNode.childNodes[1].textContent = element.textContent;
	/*
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
	*/
}

//single value or range on button groups
function rangeToggle(btn) {
	//btn.classList.toggle("active");
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

//tick all the activities if the 'activities all' button is pressed
function tick_all_acts(){
	dropdown = document.getElementById("activities-list");
	btns = dropdown.children;
	for(btn of btns){
		tick(btn);
	}
}

//-----------------------------------------------------------------------------------------------------


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
		.getElementById("first-year").textContent.replace(/\s/g, "");
	let yearEnd = document.getElementById("last-year");
	if (yearEnd.hasAttribute("disabled")) {
		yearEnd = yearStart;
	} else {
		yearEnd = yearEnd.textContent.replace(/\s/g, "");
    }
    
	let monthStart = document
		.getElementById("first-month").textContent.replace(/\s/g, "");
	let monthEnd = document.getElementById("last-month");
	if (monthEnd.hasAttribute("disabled")) {
		monthEnd = monthStart;
	} else {
		monthEnd = monthEnd.textContent.replace(/\s/g, "");
    }    
    
	let dayStart = document
		.getElementById("first-day").textContent.replace(/\s/g, "");
	let dayEnd = document.getElementById("last-day");
	if (dayEnd.hasAttribute("disabled")) {
		dayEnd = dayStart;
	} else {
		dayEnd = dayEnd.textContent.replace(/\s/g, "");
    }    
    
	let hourStart = document
		.getElementById("first-hour").textContent.replace(/\s/g, "");
	let hourEnd = document.getElementById("last-hour");
	if (hourEnd.hasAttribute("disabled")) {
		hourEnd = hourStart;
	} else {
		hourEnd = hourEnd.textContent.replace(/\s/g, "");
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

    
    if(!dayAll && (dayStart != "StartingDay")){
        dayStart = day2num(dayStart);
        dayEnd = day2num(dayEnd);
    }

    if(!monthAll && (monthStart != "StartingMonth")){
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
	let activitiesAll = false;
	if (document.getElementById("activities-all").classList.contains("btn-warning")) {
		activitiesAll = true;
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
		activitiesAll: activitiesAll,
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
		(values.indexOf("StartingYear") !== -1 //|| values.indexOf("StartingYear") !== -1) 
			&&
			!json.yearAll) ||
		(values.indexOf("StartingMonth") !== -1 // ||values.indexOf("Last Month") !== -1) 
			&&
			!json.monthAll) ||
		(values.indexOf("StartingDay") !== -1 //||values.indexOf("Last Day") !== -1) 
			&&
			!json.dayAll) ||
		(values.indexOf("StartingHour") !== -1 //||values.indexOf("Last Hour") !== -1) 
			&&
			!json.hourAll) ||
		(json.actList.length == 0
			&&
			!json.activitiesAll)
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
	fetch("http://localhost:80/project_final/backend/acts.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" }
	})
		.then(res => res.json())
		.then(res => {
			
			for(var i = 0; i < res.acts.length; i++){
				if(res.acts[i] == null){
					res.acts[i] = "NULL"
				}
			}
			
			populateActivities("activities-list", res.acts);
			//null_elem = res.acts[0];
			console.log( res.acts);
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
		fetch("http://localhost:80/project_final/backend/map.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(getJSON())
		})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				let coords = [];
				if(res.locations.length == 0){
					alert("there are no data available for those criteria that you specified!")
				}else{
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
				}
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
			tmp = btn.textContent.toLowerCase();
			a = tmp.includes("json");
			b = tmp.includes("csv");
			c = tmp.includes("xml");
			if(a){
				format = "json";
			}else if(b){
				format = "csv";
			}else{
				format = "xml";
			}

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
			"http://localhost:80/project_final/backend/extract_" +
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
	fetch("http://localhost:80/project_final/backend/map.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(getJSON())
	})
		.then(res => res.json())
		.then(res => console.log(res));


