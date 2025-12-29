import {
    ActiveElement,
    CategoryScale,
    ChartEvent,
    Chart as ChartJS,
    ChartOptions,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { TooltipModel } from 'chart.js/auto';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    maintainAspectRatio: false,
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
            hoverRadius: 4.5,
            hoverBorderColor: '#FFFFFF',
            hoverBorderWidth: 1.5,
        },
    },
    onHover: (
        _event: ChartEvent,
        _elements: ActiveElement[],
        chart: ChartJS<'line'>
    ) => {
        chart.canvas.style.cursor = 'pointer';
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
    curves: Partial<Record<CurrencySymbol, Rate[]>>,
    currencies: Set<CurrencySymbol>,
    labels: string[],
    isGlobalItayose?: boolean
) => {
    return {
        labels: labels,
        datasets: Object.keys(curves).map(key => {
            const ccy = toCurrencySymbol(key);
            if (ccy === undefined) {
                throw new Error(`Invalid currency symbol: ${key}`);
            }

            return {
                label: key,
                data: currencies.has(ccy)
                    ? curves[ccy]?.map(r => r.toNormalizedNumber())
                    : [],
                borderColor: currencyMap[ccy].chartColor,
                backgroundColor: currencyMap[ccy].chartColor,
                ...defaultDatasets,
                borderDash: isGlobalItayose ? [8, 5] : undefined,
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
            className={clsx(
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
    isGlobalItayose = false,
}: {
    title: string;
    curves: Partial<Record<CurrencySymbol, Rate[]>>;
    labels: string[];
    isGlobalItayose?: boolean;
}) => {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipLabel, setTooltipLabel] = useState<string>();
    const [tooltipPos, setTooltipPos] = useState<Position>();

    const [activeCurrencies, setActiveCurrencies] = useState<
        Set<CurrencySymbol>
    >(new Set(Object.keys(curves) as CurrencySymbol[]));

    useEffect(() => {
        if (activeCurrencies.size === 0) {
            Object.keys(curves).forEach(ccy => {
                activeCurrencies.add(ccy as CurrencySymbol);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(curves)]);

    const handleCurrencyClick = (ccy: CurrencySymbol) => {
        // Clear chart tooltip before changing datasets
        const chart = chartRef.current;
        if (chart?.tooltip) {
            chart.tooltip.setActiveElements([], { x: 0, y: 0 });
            chart.update('none');
        }

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

        setTooltipVisible(false);
        setTooltipLabel(undefined);
        setTooltipPos(undefined);
    };

    const customTooltip = useCallback(
        ({
            tooltip,
        }: {
            chart: ChartJS<'line'>;
            tooltip: TooltipModel<'line'>;
        }) => {
            if (
                !tooltip ||
                tooltip.opacity === 0 ||
                !tooltip.dataPoints ||
                tooltip.dataPoints.length === 0
            ) {
                setTooltipVisible(false);
                return;
            }

            const { x, y, title } = tooltip;

            if (!title?.length) {
                setTooltipVisible(false);
                return;
            }

            setTooltipPos({ top: y, left: x });
            setTooltipLabel(title[0]);
            setTooltipVisible(true);
        },
        []
    );

    const dataOptions: ChartOptions<'line'> = useMemo(
        () => ({
            ...options,
            animation: false,
            plugins: {
                tooltip: {
                    enabled: false,
                    external: customTooltip,
                    xAlign: 'left',
                    yAlign: 'center',
                },
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const chartData = useMemo(
        () => getData(curves, activeCurrencies, labels, isGlobalItayose),
        [curves, activeCurrencies, labels, isGlobalItayose]
    );

    const tooltipData = useMemo(() => {
        if (!tooltipLabel) {
            return {};
        }

        const tooltipIndex = labels.indexOf(tooltipLabel);
        if (tooltipIndex < 0) {
            return {};
        }

        const activeData = Object.keys(curves)
            .filter(curr => activeCurrencies.has(curr as CurrencySymbol))
            .reduce((result, curr) => {
                const currency = curr as CurrencySymbol;
                const currencyRate = curves[currency]?.[tooltipIndex];
                if (currencyRate) {
                    result[currency] = currencyRate;
                }
                return result;
            }, {} as Partial<Record<CurrencySymbol, Rate>>);

        return activeData;
    }, [activeCurrencies, curves, labels, tooltipLabel]);

    useEffect(() => {
        const canvas = chartRef.current?.canvas;
        const chart = chartRef.current;
        if (!canvas || !chart) return;

        const handleMouseLeave = () => {
            // Clear chart's internal tooltip state
            if (chart.tooltip) {
                chart.tooltip.setActiveElements([], { x: 0, y: 0 });
                chart.update('none');
            }

            setTooltipVisible(false);
            setTooltipLabel(undefined);
            setTooltipPos(undefined);
        };

        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className='box-border rounded-b-2xl border border-[#2D4064] bg-cardBackground/20 drop-shadow-tab'>
            <div className='flex flex-row justify-between bg-gradient-to-b from-[rgba(106,118,177,0.15)] from-0% to-[rgba(106,118,177,0)] to-70% pb-8 pl-7 pr-5 pt-7'>
                <h1 className='typography-body-2 text-[20px] capitalize text-white'>
                    {title}
                </h1>
                <div className='hidden flex-row items-center gap-3 tablet:flex'>
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
                    className='h-[354px] rounded-b-xl bg-black-20'
                    data={chartData}
                    options={dataOptions}
                    ref={chartRef}
                    onClick={() => {}}
                    data-chromatic='ignore'
                    plugins={[crossHairMultiPlugin]}
                />
                {tooltipPos && (
                    <GraphTooltip
                        tooltipData={tooltipData}
                        position={tooltipPos}
                        visibility={tooltipVisible}
                    />
                )}
            </div>
        </div>
    );
};

const GraphTooltip = ({
    tooltipData,
    position,
    visibility,
}: {
    tooltipData: Partial<Record<CurrencySymbol, Rate>>;
    position: Position;
    visibility: boolean;
}) => {
    const tooltipDataArray = Object.entries(tooltipData);

    if (tooltipDataArray.length === 0) {
        return null;
    }

    const sortedData = tooltipDataArray.sort(([_a, aRate], [_b, bRate]) => {
        return bRate.toNormalizedNumber() - aRate.toNormalizedNumber();
    });

    return (
        <div
            className={`absolute ml-8 flex w-40 flex-col gap-5 overflow-hidden rounded-[10px] border border-[#34384C] bg-[rgba(47,50,65,0.6)] px-3 pb-5 pt-4 shadow-curvetooltip backdrop-blur-[3px] transition-all duration-300 hover:!visible
        ${visibility ? 'visible' : 'invisible'}
        `}
            style={{
                top: position?.top,
                left: position?.left,
                pointerEvents: 'none',
            }}
        >
            {sortedData.map(([currencySymbol, rate], index) => {
                const formattedRate = rate.toNormalizedNumber().toFixed(2);

                return (
                    <div
                        className='typography-button-1 flex h-5 flex-row items-center justify-between leading-[22px]'
                        key={index}
                    >
                        <div className='flex items-center gap-2'>
                            <CurrencyIcon
                                ccy={currencySymbol as CurrencySymbol}
                                variant='small'
                            />
                            <span className='text-white'>{currencySymbol}</span>
                        </div>
                        <span className='text-nebulaTeal'>{`${formattedRate}%`}</span>
                    </div>
                );
            })}
        </div>
    );
};
