import {
    ActiveElement,
    Chart,
    ChartData,
    ChartEvent,
    ChartOptions,
} from 'chart.js';
import { PriceFormatter, Rate } from 'src/utils';
import { getColor } from '../TimeScaleSelector/constants';

export const refineArray = (array: Array<Rate>) => {
    return array.map(r => r.toNormalizedNumber());
};

export const defaultMultiLineChartDatasets = {
    borderWidth: 3,
    radius: 0,
    lineTension: 0.4,
    pointRadius: 0.01,
};

export const getMultiLineChartData = (
    rates: Rate[][],
    label: string,
    labels: string[],
    itayoseMarketIndex: Set<number>,
    itayoseBorderColor: string
): ChartData<'line'> => {
    return {
        labels: labels,
        datasets: rates.map((rate, i) => {
            return i === 0
                ? {
                      label: label,
                      data: refineArray(rate),
                      fill: true,
                      backgroundColor: getColor(i, 0.1),
                      segment: {
                          borderColor: ctx =>
                              itayoseMarketIndex.has(ctx.p1.parsed.x)
                                  ? '#C58300'
                                  : getColor(i, 1),
                          borderDash: ctx =>
                              itayoseMarketIndex.has(ctx.p1.parsed.x)
                                  ? [5, 6]
                                  : undefined,
                      },
                      pointBackgroundColor: ctx =>
                          itayoseMarketIndex.has(ctx.parsed.x)
                              ? '#C58300'
                              : getColor(i, 1),
                  }
                : {
                      label: label,
                      data: refineArray(rate),
                      fill: true,
                      backgroundColor: getColor(i, 0.1),
                      segment: {
                          borderColor: ctx =>
                              itayoseMarketIndex.has(ctx.p1.parsed.x)
                                  ? itayoseBorderColor
                                  : getColor(i, 1),
                          borderDash: [10 - i * 3, 10 - i],
                      },
                      pointBackgroundColor: getColor(i, 1),
                  };
        }),
    };
};

export const multiLineChartOptions: ChartOptions<'line'> = {
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
                    return PriceFormatter.formatPercentage(value, 'percentage');
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
                color: context => {
                    if (context.index === 0) return '#475569';
                },
            },
        },

        x: {
            beginAtZero: true,
            ticks: {
                color: '#94A3B8',
                font: {
                    lineHeight: 2.0,
                },
                padding: 10,
                align: 'center',
            },
            grid: {
                display: true,
                drawBorder: false,
                lineWidth: 0.5,
                color: '#94A3B8',
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
    events: ['click', 'mousemove'],
    plugins: {
        tooltip: {
            enabled: false,
        },
    },
};
