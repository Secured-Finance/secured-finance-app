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
    crossHairPlugin,
    defaultDatasets,
} from 'src/components/molecules/LineChart/constants';
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
    maintainAspectRatio: true,
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
        <div key={ccy} className='flex flex-row items-center justify-center'>
            <button
                data-testid='curve-chip'
                style={{ backgroundColor: currencyMap[ccy].chartColor }}
                className={classNames(
                    `typography-body-small w-14 rounded-2xl py-3 pt-2 pb-[6px] font-secondary text-xs font-semibold uppercase text-white`,
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
        </div>
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
        <div className='box-border rounded-b-2xl border border-[#2D4064] bg-[#2D4064]/20 px-6 py-7'>
            <div className='flex flex-row justify-between pb-8'>
                <h1 className='typography-modal-title flex text-[20px] capitalize leading-6 text-white'>
                    {title}
                </h1>
                <div className='flex flex-row items-center justify-evenly gap-3'>
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
                className='rounded-2xl bg-black-20 p-5'
                data={getData(curves, Array.from(activeCurrencies), labels)}
                options={options}
                ref={chartRef}
                onClick={() => {}}
                data-chromatic='ignore'
            />
        </div>
    );
};
