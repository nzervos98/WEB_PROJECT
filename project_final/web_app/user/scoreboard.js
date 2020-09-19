fetch("http://localhost:80/project_final/backend/score.php", {
	method: "POST",
	headers: { "Content-Type": "application/json" }
})
	.then(res => res.json())
	.then(res => {
		console.log(res);
		let username = res.username;
		let lastUp = res.last_up;
		let firstDt = res.first_dt;
		let lastDt = res.last_dt;
		let userScore = res.usr;
		let top3 = res.scores;

		/*
		document.getElementsByClassName("data-available").style.display="block";
		document.getElementById("no-data-available").style.display="none";
		*/

		if(firstDt == null || lastDt == null){
			document.getElementById("no-data-available").style.display="block";
			document.getElementById("username").textContent = username;

		}else{
			document.getElementById("no-data-available").style.display="none";
			span_elems = document.getElementsByClassName("data-available")

			for(span_elem of span_elems){
				span_elem.style.display="block";
			}

			document.getElementById("last-up").textContent = lastUp;
			document.getElementById("first-dt").textContent = firstDt.slice(0, 10);
			document.getElementById("last-dt").textContent = lastDt.slice(0, 10);
			document.getElementById("score").textContent = "User " + username + " has an ecological score of : " + userScore + "%";

			console.log(top3);
			labels = Object.keys(top3);
			labels.push("Your Score");
			data = Object.values(top3);
			data.push(userScore);

			ctx = document.getElementById("score-chart");
			bar = new Chart(ctx, {
				type: "bar",
				data: {
					
					labels: labels  ,
					
					datasets: [
						{
							data: data,
							backgroundColor: "LightBlue"
						}
					]
				},
				options: {
					legend: {
						labels: {
							// This more specific font property overrides the global property
							fontColor: 'Purple'
						} ,
						display: false
					},
					title: {
						display: true,
						text: "Score",
						fontSize: 30,
						fontColor: '#000000'
					},
					scales: {
						xAxes: [
							{
								ticks: { fontColor: "white"},
								gridLines: { display: false }
							}
						],
						yAxes: [
							{
								ticks: { fontColor: "white", beginAtZero: true },
								gridLines: { display: false },
								
							}
						]
					}
				}
			});
		}
	});