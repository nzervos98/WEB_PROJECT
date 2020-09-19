
let mymap = L.map("map").setView([38.230462, 21.75315], 12);
const attribution =
	'&copy; <a href="https://www.openstreetpam.org/copyright">OpenStreetMap</a> contributors';
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let tiles = L.tileLayer(url, { attribution });

tiles.addTo(mymap);

//
L.circle([38.230462, 21.75315], { radius: 10000 })
	.setStyle({ fillOpacity: 0.2, stroke: false, color: "green" })
	.addTo(mymap);

//on right click drawNoZone is executed
mymap.on("contextmenu", drawNoZone);

//lGroup is gonna contain the the rectangles in the map that the user will specify
let lGroup = L.layerGroup().addTo(mymap);

function drawNoZone(event) {
	//we define a rectangle object (which at first is a dot)
	let rect = L.rectangle(L.latLngBounds(event.latlng, event.latlng), {
		color: "red"
	}).addTo(mymap);

	let p1 = event.latlng;
	mymap.on("contextmenu", innerCall);
	mymap.off("contextmenu", drawNoZone);
	mymap.on("mousemove", drawRect);

	//this executes when the user right clicks for the second time (he drawn his rectangle)
	function innerCall() {
		mymap.off("contextmenu", innerCall);
		mymap.off("mousemove", drawRect);
		mymap.on("contextmenu", drawNoZone);
		rect.on("click", rect.remove);
		lGroup.addLayer(rect);
	}

	//this executes after the user right clicks for the first time and then he moves his mouse 
	function drawRect(event) {
		let p2 = event.latlng;
		bounds = L.latLngBounds(p1, p2);
		rect.setBounds(bounds);
	}
}

//-------------------------------------------------------------------------------------------------

//set areas that should not be included
//recs is an array which contains rect objects as elements (every rect object contains the coordinates needed to describe that corresponding rect) 
function getRectangles() {
	let recs = [];
	lGroup.eachLayer(rect => {
		recs.push({
			west: rect.getBounds().getWest(),
			north: rect.getBounds().getNorth(),
			east: rect.getBounds().getEast(),
			south: rect.getBounds().getSouth()
		});
	});
	return recs;
}

function distance(point) {
	let f1 = toRadians(point.lat);
	let f2 = toRadians(38.230462);
	let dl = toRadians(point.lng - 21.75315);
	let df = toRadians(f1 - f2);
	let R = 6371000;

	let a =
		Math.sin(df / 2) * Math.sin(df / 2) +
		Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) * Math.sin(dl / 2);

	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	let dist = R * c;
	return dist;
}

let toRadians = deg => deg * (Math.PI / 180);

function isInNoZone(rectangles, point) {
	let dist = distance(point);
	if (dist > 10000) {
		return true;
	}
	if (rectangles.length == 0) {
		return false;
	}
	for (rect of rectangles) {
		//if the expression evaluates to true then the point is in the corresponding rect  
		if (
			point.lat < rect.north &&
			point.lat > rect.south &&
			point.lng > rect.west &&
			point.lng < rect.east
		)
			return true;
	}
	return false;
}
//-------------------------------------------------------------------------------------------------

document.getElementById("file-input").addEventListener("change", handleUpload);

function readUploadedFile(input) {
	const fileReader = new FileReader();
	return new Promise((resolve, reject) => {

		fileReader.onerror = () => {
			fileReader.abort();
			reject(alert("Problem occured while parsing uploaded file."));
		};

		//if the filereader managed to read the file's content (promise resolved) and the response is a string
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		
		//Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string
		fileReader.readAsText(input);
	});
}

let globalFile;

//in this function we read the selected json file and we cut the locations(coordinates) that are included in the rectangles that the user defined
async function handleUpload(event) {
	//file contains the DOM element that triggered the "change" event 
	let file = event.target.files[0];
	globalFile = await readUploadedFile(file)
		.then(text => {
			let json = JSON.parse(text);
			console.log(json.locations)
			let newLocations = [];
			let rects = getRectangles();
			
			/*
			//testing if the >10km filtering works
			let a = {
				accuracy:100,
				latitudeE7:38.250546,
				longitudeE7:22.081095,
				timestampMs:15934202344
			};
			json.locations.push(a);
			*/

			for (loc of json.locations) {
				let point = {
					lat: loc.latitudeE7 / 10000000,
					lng: loc.longitudeE7 / 10000000
				};
				if (!isInNoZone(rects, point)) {
					//test with markers if the location cutting procedure works (rects)
					//L.marker(point).addTo(mymap);
					
					newLocations.push(loc);
				}
			}
			return { locations: newLocations };
		})
		.catch(err => console.log(err));
	document.getElementById("upload-button").toggleAttribute("disabled", false);
}


//	"First right-click twice to define exclusion zones and then select file to sumbit, left-click on an exclusion zone to cancel it"


function submit() {

	//we are hiding the upload-file div element and displaying the loading gif
	document.getElementById("upload-file").style.display="none";
	document.getElementById("loading-gif").style.display="block";

	fetch("http://localhost:80/project_final/backend/json_upload_streaming_parser.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" , 'Accept': 'application/json'  },
		body: JSON.stringify(globalFile)
	})
		.then(res => {
			return res.json();
		})
		.then(data => {
			if (data.status == "fail") {
				console.log(data);
				//alert("Upload failed!");
			} else if (data.status == "success") {
				console.log(data.msg);
				//After the upload we display upload-file div element again and hiding the loading gif
				document.getElementById("upload-file").style.display="block";
				document.getElementById("loading-gif").style.display="none";
				//alert("Succesful Upload!");
			}
		})
		.catch(res => { 
			console.log(res);
			document.getElementById("upload-file").style.display="block";
			document.getElementById("loading-gif").style.display="none";
		});

}
