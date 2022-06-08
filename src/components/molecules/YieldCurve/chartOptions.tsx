import * as chartjs from 'chart.js';

export const chartOptions: chartjs.ChartOptions = {
    layout: {
        padding: 0,
    },
    legend: {
        display: false,
    },
    scales: {
        yAxes: [
            {
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: 2,
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                    lineWidth: 1,
                },
                ticks: {
                    callback: function (value: number) {
                        return value + '%';
                    },
                },
            },
        ],
        xAxes: [
            {
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: 2,
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                },
                ticks: {
                    beginAtZero: false,
                },
            },
        ],
    },
    tooltips: {
        callbacks: {
            label: function (
                item: chartjs.ChartTooltipItem,
                data: chartjs.ChartData
            ) {
                const label = data.datasets[item.datasetIndex].label || '';
                const yLabel = item.yLabel;
                let content = '';

                if (data.datasets.length > 1) {
                    content += label;
                }

                content += ' ' + yLabel + ' %';
                return content;
            },
        },
    },
};
