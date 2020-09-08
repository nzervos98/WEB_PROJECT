fetch("http://localhost:80/project_ours_test/backend/score.php", {
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

		document.getElementById("last-up").textContent = lastUp;
		document.getElementById("first-dt").textContent = firstDt.slice(0, 10);
		document.getElementById("last-dt").textContent = lastDt.slice(0, 10);
		document.getElementById("score").textContent = username + " scored : " + userScore;

		console.log(top3);
		labels = Object.keys(top3);
		labels.push(username);
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
						backgroundColor: "DeepPink"
					}
				]
			},
			options: {
				legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'black'
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
                            ticks: { fontColor: "black"},
							gridLines: { display: false }
						}
					],
					yAxes: [
						{
							ticks: { fontColor: "black", beginAtZero: true },
                            gridLines: { display: false },
                            
						}
					]
				}
			}
		});
	});