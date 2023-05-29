import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { TooltipItem, TooltipModel } from 'chart.js/auto';
import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CurrencyIcon } from 'src/components/atoms';
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

type Position = {
    top: number;
    left: number;
};

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    layout: {
        padding: {
            top: 44,
            right: 30,
            left: 20,
            bottom: 20,
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
                    lineHeight: 2.0,
                },
                padding: 8,
            },
            grid: {
                borderDash: [8, 4],
                drawBorder: false,
                color: 'rgba(255, 255, 255, 0.1)',
                drawTicks: false,
            },
        },

        x: {
            beginAtZero: true,
            offset: true,
            ticks: {
                color: '#5D6588',
                font: {
                    lineHeight: 2.0,
                },
                padding: 8,
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
            style={{ backgroundColor: currencyMap[ccy].pillColor }}
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
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState<TooltipItem<'line'>[]>();
    const [tooltipPos, setTooltipPos] = useState<Position | null>(null);

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

    const customTooltip = useCallback(
        ({
            chart,
            tooltip,
        }: {
            chart: ChartJS<'line'>;
            tooltip: TooltipModel<'line'>;
        }) => {
            if (tooltip.opacity === 0) {
                setTooltipVisible(false);
                return;
            }

            const canvas = chart.canvas;
            if (canvas) {
                setTooltipVisible(true);

                const left = tooltip.x;
                const top = tooltip.y;

                if (tooltipPos?.top !== top) {
                    setTooltipPos({ top: top, left: left });
                    setTooltipData(tooltip.dataPoints);
                }
            }
        },
        [tooltipPos]
    );

    const dataOptions: ChartOptions<'line'> = {
        ...options,
        plugins: {
            tooltip: {
                enabled: false,
                external: customTooltip,
            },
        },
    };

    return (
        <div className='box-border rounded-b-2xl border border-[#2D4064] bg-cardBackground/20 drop-shadow-tab'>
            <div className='flex flex-row justify-between bg-gradient-to-b from-[rgba(106,118,177,0.15)] from-0% to-[rgba(106,118,177,0)] to-70% pb-8 pl-7 pr-5 pt-7'>
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
            <div className='relative pb-7 pl-6 pr-5'>
                <Line
                    className='rounded-b-xl bg-black-20'
                    data={getData(curves, Array.from(activeCurrencies), labels)}
                    options={dataOptions}
                    ref={chartRef}
                    onClick={() => {}}
                    data-chromatic='ignore'
                    plugins={[crossHairMultiPlugin]}
                />
                {tooltipPos && (
                    <GraphTooltip
                        data={tooltipData}
                        position={tooltipPos}
                        visibility={tooltipVisible}
                    />
                )}
            </div>
        </div>
    );
};

const GraphTooltip = ({
    data,
    position,
    visibility,
}: {
    data: TooltipItem<'line'>[] | undefined;
    position: Position;
    visibility: boolean;
}) => {
    return (
        <div
            className={`absolute flex w-40 flex-col gap-5 overflow-hidden rounded-[10px] border border-[#34384C] bg-[rgba(47,50,65,0.6)] px-3 pb-5 pt-4 shadow-curvetooltip backdrop-blur-[3px] transition-all duration-300 hover:!visible
        ${visibility ? 'visible' : 'invisible'}
          `}
            style={{
                top: position?.top,
                left: position?.left,
            }}
        >
            {data && (
                <>
                    {data.map((val, index) => {
                        return (
                            <div
                                className='typography-button-1 flex h-5 flex-row items-center justify-between leading-[22px]'
                                key={index}
                            >
                                <div className='flex items-center gap-2'>
                                    <CurrencyIcon
                                        ccy={
                                            val.dataset.label as CurrencySymbol
                                        }
                                        variant='small'
                                    />
                                    <span className='text-white'>
                                        {val.dataset.label}
                                    </span>
                                </div>
                                <span className='text-nebulaTeal'>
                                    {`${val.formattedValue}%`}
                                </span>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};
