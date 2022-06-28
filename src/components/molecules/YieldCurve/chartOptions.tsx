import * as chartjs from 'chart.js';

export const chartOptions: chartjs.ChartOptions = {
    layout: {
        padding: 0,
    },

    scales: {
        axisY: {
            grid: {
                borderDash: [2],
                borderDashOffset: 2,
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false,
                lineWidth: 1,
            },
            ticks: {
                callback: function (value: number | string) {
                    return value + '%';
                },
            },
        },
        axisX: {
            beginAtZero: false,
            grid: {
                borderDash: [2],
                borderDashOffset: 2,
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1,
            },
            ticks: {},
        },
    },

    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function (
                    item: chartjs.TooltipItem<keyof chartjs.ChartTypeRegistry>
                ) {
                    // const label = item.dataset[item.datasetIndex].label || '';
                    // const yLabel = item.yLabel;
                    // let content = '';

                    // if (data.datasets.length > 1) {
                    //     content += label;
                    // }

                    // content += ' ' + yLabel + ' %';
                    return 'arpit';
                },
            },
        },
    },
};
