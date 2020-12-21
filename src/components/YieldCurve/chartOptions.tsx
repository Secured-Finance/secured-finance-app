export const chartOptions = {
	layout: {
		padding: 0
	},
	legend: {
		display: false,
	},
	scales: {
	  yAxes: [
		{
		  gridLines: {
			borderDash: [2],
			borderDashOffset: [2],
			color: 'rgba(0, 0, 0, 0.1)',
			drawBorder: false,
			// drawTicks: false,
			lineWidth: 1,
			// zeroLineWidth: 0,
			// zeroLineColor: 'rgba(97, 92, 107, 0.1)',
			// zeroLineBorderDash: [2],
			// zeroLineBorderDashOffset: [2]
		  },
		  ticks: {
			// beginAtZero: true,
			// padding: 5,
			callback: function(value: number) {
				return value + "%";
			}
		  }
		}
	  ],
	  xAxes: [
		{
			gridLines: {
				borderDash: [2],
				borderDashOffset: [2],
				color: 'rgba(0, 0, 0, 0.1)',
				lineWidth: 1,
			},
			ticks: {
				beginAtZero: false,
			}
		},
	  ]
	},
	tooltips: {
		filter: function(item: any, data: any) {
			return item.value > 0
		},
		callbacks: {
			label: function(item: any, data: any) {
				if (item.value > 0) {

				var label = data.datasets[item.datasetIndex].label || "";
				var yLabel = item.yLabel;
				var content = "";
	
				if (data.datasets.length > 1) {
				content += label;
				}
	
				content += " " + yLabel + " %";
				return content;  
				} return false
			}
		}
	},
}
