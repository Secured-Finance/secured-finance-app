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
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    crossHairMultiPlugin,
    defaultDatasets,
} from 'src/components/molecules/LineChart/constants';
import { currencyMap, CurrencySymbol, Rate, toCurrencySymbol } from 'src/utils';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip
);

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    layout: {
        padding: {
            top: 20,
        },
    },
    elements: {
        point: {
            hoverRadius: 6,
            hoverBorderColor: '#FFFFFF',
            hoverBorderWidth: 2,
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
                color: '#5D6588',
                font: {
                    lineHeight: 1.0,
                },
                padding: 8,
            },
            grid: {
                borderDash: [8, 8],
                drawBorder: false,
                color: 'rgba(255, 255, 255, 0.1)',
                drawTicks: false,
            },
        },

        x: {
            beginAtZero: false,
            ticks: {
                color: '#5D6588',
                font: {
                    lineHeight: 2.0,
                },
                padding: 16,
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

const getData = (
    curves: Record<CurrencySymbol, Rate[]>,
    currencies: CurrencySymbol[],
    labels: string[]
) => {
    return {
        labels: labels,
        datasets: Object.keys(curves)
            .filter(v => currencies.includes(v as CurrencySymbol))
            .map(key => {
                const ccy = toCurrencySymbol(key);
                if (ccy === undefined) {
                    throw new Error(`Invalid currency symbol: ${key}`);
                }

                return {
                    label: key,
                    data: curves[ccy].map(r => r.toNormalizedNumber()),
                    borderColor: currencyMap[ccy].chartColor,
                    backgroundColor: currencyMap[ccy].chartColor,
                    ...defaultDatasets,
                };
            }),
    };
};

const CurveChip = ({
    ccy,
    onClick,
}: {
    ccy: CurrencySymbol;
    active: boolean;
    onClick: (ccy: CurrencySymbol) => void;
}) => {
    const [active, setActive] = useState(true);
    return (
        <button
            data-testid='curve-chip'
            style={{ backgroundColor: currencyMap[ccy].chartColor }}
            className={classNames(
                `flex w-fit items-center justify-center rounded-xl px-3 py-2 font-secondary text-xs font-semibold uppercase leading-3 text-neutral-8`,
                {
                    'opacity-50': !active,
                }
            )}
            onClick={() => {
                setActive(!active);
                onClick(ccy);
            }}
        >
            <p>{ccy}</p>
        </button>
    );
};

export const MultiCurveChart = ({
    title,
    curves,
    labels,
}: {
    title: string;
    curves: Record<CurrencySymbol, Rate[]>;
    labels: string[];
}) => {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const [activeCurrencies, setActiveCurrencies] = useState<
        Set<CurrencySymbol>
    >(new Set(Object.keys(curves) as CurrencySymbol[]));

    const handleCurrencyClick = (ccy: CurrencySymbol) => {
        if (activeCurrencies.has(ccy)) {
            setActiveCurrencies(prev => {
                const newSet = new Set(prev);
                newSet.delete(ccy);
                return newSet;
            });
        } else {
            setActiveCurrencies(prev => {
                const newSet = new Set(prev);
                newSet.add(ccy);
                return newSet;
            });
        }
    };

    return (
        <div className='box-border rounded-b-2xl border border-[#2D4064] bg-cardBackground/20 px-6 py-7'>
            <div className='flex flex-row justify-between pb-8'>
                <h1 className='typography-body-2 text-[20px] capitalize text-white'>
                    {title}
                </h1>
                <div className='flex flex-row items-center gap-3'>
                    {Object.keys(curves).map(key => {
                        const ccy = toCurrencySymbol(key);
                        if (ccy === undefined) {
                            throw new Error(`Invalid currency symbol: ${key}`);
                        }
                        return (
                            <CurveChip
                                key={ccy}
                                ccy={ccy}
                                active={true}
                                onClick={handleCurrencyClick}
                            />
                        );
                    })}
                </div>
            </div>
            <Line
                className='rounded-b-2xl bg-black-20 p-5'
                data={getData(curves, Array.from(activeCurrencies), labels)}
                options={options}
                ref={chartRef}
                onClick={() => {}}
                data-chromatic='ignore'
                plugins={[crossHairMultiPlugin]}
            />
        </div>
    );
};
