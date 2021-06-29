import cm from './LineChart.module.scss';

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

export const options = {
    responsive: true,
    scales: {
        yAxes: [
            {
                ticks: {
                    color: '#5f616a',
                    fontSize: 13,
                },
                gridLines: {
                    color: '#5f616a50',
                    drawBorder: false,
                },
            },
        ],
        xAxes: [
            {
                ticks: {
                    color: '#5f616a',
                    fontSize: 13,
                },
                gridLines: {
                    color: '#5f616a50',
                    drawBorder: false,
                },
            },
        ],
    },
    callbacks: {},
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
