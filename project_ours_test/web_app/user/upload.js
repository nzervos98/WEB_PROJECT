let mymap = L.map("map").setView([38.230462, 21.75315], 12);
const attribution =
	'&copy; <a href="https://www.openstreetpam.org/copyright">OpenStreetMap</a> contributors';
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let tiles = L.tileLayer(url, { attribution });

tiles.addTo(mymap);

L.circle([38.230462, 21.75315], { radius: 10000 })
	.setStyle({ fillOpacity: 0.2, stroke: false, color: "green" })
	.addTo(mymap);

mymap.on("contextmenu", drawNoZone);
let lGroup = L.layerGroup().addTo(mymap);

function drawNoZone(event) {
	let rect = L.rectangle(L.latLngBounds(event.latlng, event.latlng), {
		color: "red"
	}).addTo(mymap);

	let p1 = event.latlng;
	mymap.on("contextmenu", innerCall);
	mymap.off("contextmenu", drawNoZone);
	mymap.on("mousemove", drawRect);

	function innerCall() {
		mymap.off("contextmenu", innerCall);
		mymap.off("mousemove", drawRect);
		mymap.on("contextmenu", drawNoZone);
		rect.on("click", rect.remove);
		lGroup.addLayer(rect);
	}

	function drawRect(event) {
		let p2 = event.latlng;
		bounds = L.latLngBounds(p1, p2);
		rect.setBounds(bounds);
	}
}

//-------------------------------------------------------------------------------------------------

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
			reject(alert("Problem parsing File"));
		};

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.readAsText(input);
	});
}

let globalFile;

async function handleUpload(event) {
	let file = event.target.files[0];
	globalFile = await readUploadedFile(file)
		.then(text => {
			let json = JSON.parse(text);
			let newLocations = [];
			let rects = getRectangles();
			for (loc of json.locations) {
				let point = {
					lat: loc.latitudeE7 / 10000000,
					lng: loc.longitudeE7 / 10000000
				};
				if (!isInNoZone(rects, point)) {
					//L.marker(point).addTo(mymap);
					newLocations.push(loc);
				}
			}
			return { locations: newLocations };
		})
		.catch(err => console.log(err));
	document.getElementById("upload-button").toggleAttribute("disabled", false);
}

//alert(
//	"First right-click twice to define exclusion zones and then select file to sumbit, left-click on an exclusion zone to cancel it"
//);

function submit() {

	//we are hiding the upload-file div element and displaying the loading gif
	document.getElementById("upload-file").style.display="none";
	document.getElementById("loading-gif").style.display="block";

	fetch("http://localhost:80/project_ours_test/backend/json_upload_streaming_parser.php", {
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
