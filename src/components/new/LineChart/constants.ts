import { ChartOptions } from 'chart.js';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

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
    // opacity: 1,
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

export const options: ChartOptions<'line'> = {
    responsive: true,
    layout: {
        padding: {
            // left: 34,
        },
    },
    scales: {
        y: {
            ticks: {
                // fontSize: 13,
                // padding: 34,
                callback: (value: number | string) => value + '%',
                mirror: true,
            },

            grid: {
                drawBorder: false,
                // zeroLineColor: yAxisGradient,
                drawTicks: false,
            },
        },

        x: {
            ticks: {
                // fontSize: 13,
                padding: 8,
            },
            grid: {
                color: xAxisGradient, // hides xAxis grid except for zero line
                drawBorder: false,
                // zeroLineColor: xAxisZeroLineGradient,
                drawTicks: false,
            },
        },
    },
    plugins: {
        // tooltip: {},
        legend: {
            display: false,
            position: 'right',
        },
    },
};
