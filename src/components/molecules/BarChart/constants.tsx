import { ChartOptions } from 'chart.js';
import { getColor } from 'src/components/molecules/TimeScaleSelector/constants';
import { PriceFormatter, Rate } from 'src/utils';

export const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: false,
        },
    },
    color: 'rgba(255, 255, 255, 0.6)',
    scales: {
        y: {
            beginAtZero: true,
            display: true,
            grid: {
                color: context => {
                    if (context.tick.value === 0 || context.index === 0)
                        return '#5b7280';
                },
                offset: false,
                borderWidth: 1,
                display: true,
                drawBorder: false,
            },
            ticks: {
                callback: function (value: string | number) {
                    return PriceFormatter.formatPercentage(
                        Number(value),
                        100,
                        1,
                        1
                    );
                },
                color: 'rgba(255, 255, 255, 0.6)',
                padding: 20,
            },
        },
        x: {
            beginAtZero: true,
            offset: true,
            grid: {
                color: context => {
                    if (context.index === 0) {
                        return '#5b7280';
                    }
                },

                offset: true,
            },
            ticks: {
                align: 'center',
                color: '#94A3B8',
                stepSize: 50,
            },
        },
    },
};

export const getData = (rates: Rate[][], maturityList: string[]) => {
    const data = {
        labels: maturityList,
        datasets: getDatasets(rates),
    };
    return data;
};

const getDataDifference = (zeroIndex: number[], rate: Rate[]) => {
    const data = rate.map((r, i) => zeroIndex[i] - r.toNormalizedNumber());
    return data;
};

const getDatasets = (rates: Rate[][]) => {
    if (rates.length === 0) {
        return [];
    }

    const rateZeroIndex = rates[0].map(r => r.toNormalizedNumber());
    return rates.slice(1).map((rate, index) => {
        return {
            data: getDataDifference(rateZeroIndex, rate),
            backgroundColor: getColor(index + 1, 1),
            barThickness: 20,
        };
    });
};
