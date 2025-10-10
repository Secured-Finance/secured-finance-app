import {
    ActiveElement,
    Chart,
    ChartData,
    ChartEvent,
    ChartOptions,
    ChartTypeRegistry,
    ScriptableContext,
    TooltipItem,
} from 'chart.js';
import { formatter, Rate } from 'src/utils';

export const defaultDatasets = {
    borderWidth: 3,
    radius: 0,
    lineTension: 0.4,
    pointRadius: 0.01,
};

const refineArray = (array: Array<Rate>) => {
    return array.map(r => r.toNormalizedNumber());
};

export const getData = (
    rates: Rate[],
    label: string,
    labels: string[],
    itayoseMarketIndex: Set<number>,
    itayoseBorderColor: string
): ChartData<'line'> => {
    return {
        labels: labels,
        datasets: [
            {
                label: label,
                data: refineArray(rates),
                segment: {
                    borderColor: ctx =>
                        itayoseMarketIndex.has(ctx.p1.parsed.x)
                            ? itayoseBorderColor
                            : getCurveGradient(
                                  ctx as unknown as ScriptableContext<'line'>
                              ),
                    borderDash: ctx =>
                        itayoseMarketIndex.has(ctx.p1.parsed.x)
                            ? [5, 7]
                            : undefined,
                },
                pointBackgroundColor: ctx =>
                    itayoseMarketIndex.has(ctx.dataIndex)
                        ? itayoseBorderColor
                        : getCurveGradient(
                              ctx as unknown as ScriptableContext<'line'>
                          ),
            },
        ],
    };
};

export const crossHairPlugin = {
    id: 'cross-hair',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: (chart: any) => {
        if (
            chart.tooltip &&
            chart.tooltip._active &&
            chart.tooltip._active.length
        ) {
            const activePoint = chart.tooltip._active[0];
            const ctx = chart.ctx;
            const x = activePoint.element.x;
            const y = activePoint.element.y;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, bottomY + 15);
            ctx.lineWidth = 1;
            const gradient = ctx.createLinearGradient(x, bottomY, x, topY);
            gradient.addColorStop(0, 'rgba(217, 217, 217, 0.1)');
            gradient.addColorStop(1, 'rgba(217, 217, 217, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 20, topY, 40, bottomY - topY);
            ctx.setLineDash([8, 8]);
            ctx.strokeStyle = 'rgba(252, 252, 253, 1)';
            ctx.stroke();
            ctx.restore();
        }
    },
};

export const crossHairMultiPlugin = {
    id: 'cross-hair-multi',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: (chart: any) => {
        if (
            chart.tooltip &&
            chart.tooltip._active &&
            chart.tooltip._active.length
        ) {
            const activePoint = chart.tooltip._active[0];
            const ctx = chart.ctx;
            const x = activePoint.element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#4A5061';
            ctx.stroke();
            ctx.restore();
        }
    },
};

export const getCurveGradient = (context: ScriptableContext<'line'>) => {
    const ctx = context.chart.ctx;
    const yieldCurveGradient = ctx.createLinearGradient(
        0,
        0,
        ctx.canvas.offsetWidth,
        0
    );
    yieldCurveGradient.addColorStop(0, 'rgba(255, 89, 248, 0)');
    yieldCurveGradient.addColorStop(0.2, 'rgba(174, 114, 255, 1)');
    yieldCurveGradient.addColorStop(0.5, 'rgba(144, 233, 237, 1)');
    yieldCurveGradient.addColorStop(0.78, 'rgba(92, 209, 103, 1)');
    yieldCurveGradient.addColorStop(1, 'rgba(255, 238, 0, 0)');
    return yieldCurveGradient;
};

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
        includeInvisible: true,
    },
    elements: {
        point: {
            hoverRadius: 6,
            hoverBorderColor: '#FFFFFF',
            hoverBorderWidth: 2,
            backgroundColor: '#5162FF',
        },
    },
    scales: {
        y: {
            beginAtZero: false,
            display: true,
            ticks: {
                callback: function (value: string | number) {
                    return formatter.percentage(Number(value), 1, 100);
                },
                color: 'rgba(255, 255, 255, 0.6)',
                font: {
                    lineHeight: 2.0,
                },
                padding: 20,
                maxTicksLimit: 8,
            },
            grid: {
                display: false,
                drawBorder: false,
            },
        },

        x: {
            beginAtZero: true,
            ticks: {
                color: 'rgba(255, 255, 255, 0.6)',
                font: {
                    lineHeight: 2.0,
                },
                padding: 10,
            },
            grid: {
                display: false,
                drawBorder: false,
            },
        },
    },
    hover: {
        intersect: false,
    },
    onHover: (
        _event: ChartEvent,
        _elements: ActiveElement[],
        chart: Chart<'line'>
    ) => {
        chart.canvas.style.cursor = 'pointer';
    },
    plugins: {
        tooltip: {
            yAlign: 'bottom',
            caretPadding: 16,
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
    events: ['click', 'mousemove'],
};
