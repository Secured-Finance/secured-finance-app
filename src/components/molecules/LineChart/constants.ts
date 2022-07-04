import {
    ActiveElement,
    ChartEvent,
    ChartOptions,
    ChartTypeRegistry,
    TooltipItem,
} from 'chart.js';

export const defaultDatasets = {
    borderWidth: 3,
    radius: 0,
    lineTension: 0.4,
    pointRadius: 0.01,
};

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 50,
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
        y: {
            beginAtZero: true,
            display: false,
        },

        x: {
            beginAtZero: true,
            ticks: {
                backdropColor: 'rgba(255, 255, 0, 0.6)',
                padding: 10,
            },
            grid: {
                display: false,
            },
        },
    },
    hover: {
        intersect: false,
    },
    plugins: {
        tooltip: {
            yAlign: 'bottom',
            caretPadding: 15,
            backgroundColor: 'rgba(47, 50, 65, 1)',
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
    },
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
            const x = activePoint.element.x;
            const y = activePoint.element.y;
            const bottomY = this.chartArea.bottom;
            ctx.beginPath();
            ctx.moveTo(x, y + 12);
            ctx.lineTo(x, bottomY + 15);
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#FCFCFD';
            ctx.stroke();
        }
    },
};
