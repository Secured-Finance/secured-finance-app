import {
    ActiveElement,
    Chart,
    ChartData,
    ChartEvent,
    ChartOptions,
    TooltipItem,
    TooltipModel,
} from 'chart.js';
import { Rate, percentFormat } from 'src/utils';
import { getColor, timeScaleMapping } from '../TimeScaleSelector/constants';

export const defaultDatasets = {
    borderWidth: 3,
    radius: 0,
    lineTension: 0.4,
    pointRadius: 0.01,
};

export const refineArray = (array: Array<Rate>) => {
    return array.map(r => r.toNormalizedNumber());
};

export const getData = (
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
                    return percentFormat(Number(value), 100, 1, 1);
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
                align: 'start',
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
};

export function createTooltipElement(
    id: string,
    minWidth: string,
    isMaximised: boolean
): HTMLDivElement {
    let tooltipEl = document.getElementById(id) as HTMLDivElement | null;

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = id;
        document.body.appendChild(tooltipEl);
    }

    tooltipEl.classList.remove('p-1.5', 'p-3', 'text-xs', 'text-base');
    tooltipEl.classList.add(
        'border',
        'border-neutral-400',
        'bg-neutral-900',
        'bg-opacity-60',
        `${isMaximised ? 'p-3' : 'p-1.5'}`,
        'rounded-md',
        'text-neutral-300',
        `${isMaximised ? 'text-base' : 'text-xs'}`,
        'absolute',
        'laptop:ml-[-40px]',
        'ml-0',
        `desktop:min-w-[${minWidth}px]`,
        `w-[${Number(minWidth) - 20}px]`,
        'pointer-events-none',
        'whitespace-nowrap'
    );

    return tooltipEl;
}

export const generateTooltipContent = (
    tooltip: TooltipModel<'line'>,
    selectedTimeScales: { label: string; value: string }[]
) => {
    let lineContent = '';
    let barContent = '';

    tooltip.dataPoints.forEach((dataPoint: TooltipItem<'line'>, i: number) => {
        const scale = selectedTimeScales[dataPoint.datasetIndex];
        if (!scale) return;
        const formattedValue = Number(
            dataPoint.formattedValue.replace(/,/g, '')
        );

        lineContent += `
        <div class="flex justify-between gap-8">
          <span class="text-neutral-300 text-[11] font-numerical">${
              scale.label === 'Current Yield'
                  ? 'Current APR'
                  : `${timeScaleMapping[scale.label]} Ago`
          }:</span>
          <span class="text-neutral-50 font-numerical text-[11]">${formattedValue.toFixed(
              2
          )}%</span>
        </div>`;

        if (i !== 0) {
            const value =
                Number(tooltip.dataPoints[0].formattedValue.replace(/,/g, '')) -
                formattedValue;

            barContent += `
          <div class="flex justify-between gap-4">
            <span class="text-neutral-300 text-[11] font-numerical">vs ${
                scale.label === 'Current Yield'
                    ? 'Current APR'
                    : `${timeScaleMapping[scale.label]}`
            }:</span>
            <span class="font-numerical text-[11] ${
                value < 0 ? 'text-[#FF9FAE]' : 'text-[#AAE8B0]'
            }">${value >= 0 ? '+' : ''}${value.toFixed(2)}%</span>
          </div>`;
        }
    });

    return { lineContent, barContent };
};
