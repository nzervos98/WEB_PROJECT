
document.getElementById("delete-data").onclick = deleteData ;

function deleteData(){
	let r = confirm("Delete All Data?");
	if (r == true) {
		fetch("http://localhost:80/project_final/backend/delete.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" }
		}).then(res => res.text())
		.then(res => console.log(res))
		.then(res => alert("Data Deleted Successfully!"))
		.catch(res => console.log(res));
	}
}