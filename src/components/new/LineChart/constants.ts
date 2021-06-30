const canvas: HTMLCanvasElement = document.createElement('canvas');
let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const purpleGradient = ctx.createLinearGradient(0, 0, 0, 290);
purpleGradient.addColorStop(0, 'rgba(91, 80, 222, 0.5)');
purpleGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

const greenGradient = ctx.createLinearGradient(0, 0, 0, 290);
greenGradient.addColorStop(0, 'rgba(147, 194, 87, 1)');
greenGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

const redGradient = ctx.createLinearGradient(0, 0, 0, 290);
redGradient.addColorStop(0, 'rgba(222, 95, 66, 1)');
redGradient.addColorStop(1, 'rgba(15, 26, 34, 0.1)');

const yAxisGradient = ctx.createLinearGradient(0, 100, 600, 100);
yAxisGradient.addColorStop(0, 'rgba(53, 54, 61, 0.3)');
yAxisGradient.addColorStop(0.9, 'rgba(53, 54, 61, 0.1)');
yAxisGradient.addColorStop(1, 'rgba(53, 54, 61, 0)');

const xAxisGradient = ctx.createLinearGradient(0, 100, 600, 100);
xAxisGradient.addColorStop(0, 'rgba(53, 54, 52, 0.3)');
xAxisGradient.addColorStop(0.05, 'rgba(53, 54, 61, 0)');

const xAxisZeroLineGradient = ctx.createLinearGradient(300, 200, 300, 0);
xAxisZeroLineGradient.addColorStop(0.6, 'rgba(53, 54, 61, 0.3)');
xAxisZeroLineGradient.addColorStop(1, 'rgba(53, 54, 61, 0)');

export const commonDataset = {
    fill: true,
    pointHitRadius: 100,
    borderWidth: 2,
    opacity: 1,
    hidden: false,
    radius: 0,
    hoverRadius: 3,
};

export const defaultDatasets = [
    {
        ...commonDataset,
        backgroundColor: purpleGradient,
        borderColor: '#5b50de',
    },
    {
        ...commonDataset,
        backgroundColor: redGradient,
        borderColor: '#de5f42',
    },
    {
        ...commonDataset,
        backgroundColor: greenGradient,
        borderColor: '#93c257',
    },
];

const getYAxisLinesColor = () => {
    // hack for hiding the last yAxis line for charts of 20 ticks max
    const colors: Array<string | CanvasGradient> = ['transparent'];
    for (let i = 0; i < 20; i++) {
        colors.push(yAxisGradient);
    }

    return colors;
};

export const options = {
    responsive: true,
    scales: {
        yAxes: [
            {
                color: yAxisGradient,
                ticks: {
                    color: '#5f616a',
                    fontSize: 13,
                    padding: 8,
                    callback: (value: number) => value + '%',
                },
                gridLines: {
                    color: getYAxisLinesColor(),
                    drawBorder: false,
                    zeroLineColor: yAxisGradient,
                    drawTicks: false,
                },
            },
        ],
        xAxes: [
            {
                ticks: {
                    color: '#5f616a',
                    fontSize: 13,
                    padding: 8,
                },
                gridLines: {
                    color: xAxisGradient, // hides xAxis grid except for zero line
                    drawBorder: false,
                    zeroLineColor: xAxisZeroLineGradient,
                    drawTicks: false,
                },
            },
        ],
    },
    tooltips: {
        filter: (item: any) => {
            return item.value > 0;
        },
        callbacks: {
            label: ({ value, datasetIndex, yLabel }: any, data: any) => {
                if (value > 0) {
                    const label = data.datasets[datasetIndex].label || '';
                    let content = '';

                    if (data.datasets.length > 1) {
                        content += label;
                    }

                    content += ' ' + yLabel + ' %';
                    return content;
                }
                return false;
            },
        },
    },
    legend: {
        display: false,
        position: 'right',
    },
    legendCallback: (chart: any) => {
        const ul = document.createElement('ul');
        chart.data?.datasets?.forEach((dataset: any) => {
            const borderColor = dataset.borderColor;
            ul.innerHTML += `
                <li>
                   <span class="legendMarker" style="background-color: ${borderColor}"></span>
                    ${dataset.label}
                 </li>
              `;
        });
        return ul.outerHTML;
    },
};
