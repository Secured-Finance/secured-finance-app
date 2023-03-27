import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    ChartTypeRegistry,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    TooltipItem,
} from 'chart.js';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { crossHairPlugin } from 'src/components/molecules/LineChart/constants';
import { currencyMap, CurrencySymbol, Rate, toCurrencySymbol } from 'src/utils';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
    crossHairPlugin
);

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    layout: {
        padding: {
            top: 50,
        },
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
            beginAtZero: true,
            display: true,
            ticks: {
                callback: function (value: string | number) {
                    return value.toString() + '%';
                },
            },
            grid: {
                borderDash: [2],
                drawBorder: false,
                borderColor: 'rgba(255, 255, 255, 0.1)',
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
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        },
    },
    hover: {
        intersect: false,
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
                    return `${item.dataset?.label || ''} ${
                        item.formattedValue
                    }%`;
                },
                title: () => {
                    return '';
                },
            },
        },
    },
    events: ['click', 'mousemove'],
};

const getData = (curves: Record<CurrencySymbol, Rate[]>, labels: string[]) => {
    return {
        labels: labels,
        datasets: Object.keys(curves).map(key => {
            const ccy = toCurrencySymbol(key);
            if (ccy === undefined) {
                throw new Error(`Invalid currency symbol: ${key}`);
            }

            return {
                label: key,
                data: curves[ccy].map(r => r.toNormalizedNumber()),
                borderColor: currencyMap[ccy].chartColor,
                backgroundColor: currencyMap[ccy].chartColor,
            };
        }),
    };
};

export const MultiCurveChart = ({
    curves,
    labels,
}: {
    curves: Record<CurrencySymbol, Rate[]>;
    labels: string[];
}) => {
    const chartRef = useRef<ChartJS<'line'>>(null);

    return (
        <Line
            data={getData(curves, labels)}
            options={options}
            ref={chartRef}
            onClick={() => {}}
            data-chromatic='ignore'
        />
    );
};
