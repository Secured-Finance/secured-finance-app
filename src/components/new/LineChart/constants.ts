import type {
    ActiveElement,
    ChartEvent,
    ChartOptions,
    ChartTypeRegistry,
    TooltipItem,
} from 'chart.js';
import Chart from 'chart.js/auto';

const canvas: HTMLCanvasElement = document.createElement('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const purpleGradient = ctx.createLinearGradient(0, 0, 0, 350);
purpleGradient.addColorStop(0, 'rgba(255, 89, 248, 0)');
purpleGradient.addColorStop(0.2, 'rgba(174, 114, 255, 1)');
purpleGradient.addColorStop(0.5, 'rgba(144, 233, 237, 1');
purpleGradient.addColorStop(0.7, 'rgba(92, 209, 103, 1)');
purpleGradient.addColorStop(1, 'rgba(255, 238, 0, 0)');

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
    fill: false,
    hitRadius: 12,
    borderWidth: 3,
    opacity: 1,
    hidden: false,
    radius: 0,
    // hoverRadius: 3,
};

export const defaultDatasets = [
    {
        ...commonDataset,
        // backgroundColor: purpleGradient,
        borderColor: purpleGradient,
    },
    // {
    //     ...commonDataset,
    //     backgroundColor: redGradient,
    //     borderColor: '#de5f42',
    // },
    // {
    //     ...commonDataset,
    //     backgroundColor: greenGradient,
    //     borderColor: '#93c257',
    // },
];

export const options: ChartOptions<'line'> = {
    responsive: true,
    layout: {
        padding: {
            left: 34,
        },
    },
    elements: {
        point: {
            hoverRadius: 12,
            hoverBorderColor: '#FFFFFF',
            hoverBorderWidth: 2,
            backgroundColor: '#5162FF',
        },
    },
    scales: {
        y: { display: false },
        x: {
            ticks: {
                // fontSize: 13,
                // padding: 8,
                backdropColor: 'rgba(255, 255, 0, 0.6)',
                // backdropPadding: 200,
            },
            grid: {
                display: false,
                // color: xAxisGradient, // hides xAxis grid except for zero line
                // drawBorder: false,
                // // zeroLineColor: xAxisZeroLineGradient,
                // drawTicks: false,
                // display: false,
            },
        },
    },
    plugins: {
        tooltip: {
            yAlign: 'bottom',
            caretPadding: 20,
            backgroundColor: 'rgba(47, 50, 65, 0.5)',
            borderWidth: 1,
            borderColor: 'rgba(52, 56, 76, 1)',
            displayColors: false,
            cornerRadius: 10,
            padding: 8,
            callbacks: {
                label: (item: TooltipItem<keyof ChartTypeRegistry>) => {
                    let content = '';
                    content += item.formattedValue + '%';
                    return content;
                },
                title: () => {
                    return '';
                },
            },
        },
        legend: {
            display: false,
            position: 'right',
        },
    },
    hover: {
        intersect: true,
        // onHover : () => {}
    },
    // events: ['mousemove', 'mouseout'],
    onHover: function (
        this: Chart,
        event: ChartEvent,
        activeElements: ActiveElement[]
    ): void {
        if (activeElements.length) {
            const activePoint = activeElements[0];
            const ctx = this.ctx;
            if (!ctx) {
                //return;
            }
            // console.log(event.type === 'mouseout' ? 'arpit' : '');
            const x = activePoint.element.x;
            const y = activePoint.element.y;
            const bottomY = this.chartArea.bottom;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, bottomY);
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FCFCFD';
            ctx.stroke();
        }
    },
};
