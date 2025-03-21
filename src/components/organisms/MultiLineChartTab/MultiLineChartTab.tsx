import {
    ArrowDownTrayIcon,
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import { ChartOptions } from 'chart.js';
import clsx from 'clsx';
import domtoimage from 'dom-to-image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BarChart from 'src/components/molecules/BarChart/BarChart';
import {
    createTooltipElement,
    generateTooltipContent,
    getData,
    MultiLineChart,
    options,
} from 'src/components/molecules/MultiLineChart';
import TimeScaleSelector from 'src/components/molecules/TimeScaleSelector/TimeScaleSelector';
import { useIsGlobalItayose } from 'src/hooks';
import { useYieldCurveMarketRatesHistorical } from 'src/hooks/useYieldCurveHistoricalRates';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalYieldIntervals } from 'src/types';
import {
    ButtonEvents,
    ButtonProperties,
    currencyMap,
    ONE_PERCENT,
    Rate,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';

export const MultiLineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
    maximumRate,
    marketCloseToMaturityOriginalRate,
}: {
    rates: Rate[];
    maturityList: MaturityListItem[];
    itayoseMarketIndexSet: Set<number>;
    followLinks?: boolean;
    maximumRate: number;
    marketCloseToMaturityOriginalRate: number;
}) => {
    const [selectedTimeScales, setSelectedTimeScales] = useState([
        { label: 'Current Yield', value: '0' },
    ]);
    const componentRef = useRef<HTMLDivElement>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [historicalRates, setHistoricalRates] = useState<Rate[][]>([rates]);
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: isGlobalItayose } = useIsGlobalItayose();
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const fetchedRates = useYieldCurveMarketRatesHistorical();
    useEffect(() => {
        return () => {
            ['chart-tooltip-line', 'chart-tooltip-bar'].forEach(id => {
                const tooltipEl = document.getElementById(id);
                tooltipEl?.remove();
            });
        };
    }, []);

    useEffect(() => {
        if (fetchedRates) {
            setHistoricalRates([
                rates,
                ...selectedTimeScales
                    .map(
                        interval =>
                            fetchedRates[
                                interval.value as HistoricalYieldIntervals
                            ]
                    )
                    .filter(data => data && data.length > 0),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTimeScales]);

    const itayoseBorderColor = !isGlobalItayose
        ? '#B9BDEA'
        : currencyMap[currency].chartColor;

    const data = getData(
        historicalRates,
        'Market price',
        maturityList.map(item => item.label),
        itayoseMarketIndexSet,
        itayoseBorderColor
    );

    const chartOptions: ChartOptions<'line'> = {
        ...options,
        scales: {
            ...options.scales,
            y: {
                ...options.scales?.y,
                position: 'left',
                max:
                    marketCloseToMaturityOriginalRate > maximumRate &&
                    maximumRate > 0
                        ? Math.floor((maximumRate * 1.2) / ONE_PERCENT)
                        : undefined,
            },
        },
        plugins: {
            tooltip: {
                enabled: false,
                external: function (context) {
                    const { chart, tooltip } = context;
                    const lineTooltipEl = createTooltipElement(
                        'chart-tooltip-line',
                        '160',
                        isMaximized
                    );
                    const barTooltipEl = createTooltipElement(
                        'chart-tooltip-bar',
                        '130',
                        isMaximized
                    );

                    lineTooltipEl.innerHTML = '';
                    barTooltipEl.innerHTML = '';
                    const { lineContent, barContent } = generateTooltipContent(
                        tooltip,
                        selectedTimeScales
                    );
                    lineTooltipEl.style.zIndex = `${isMaximized ? '51' : '24'}`;
                    barTooltipEl.style.zIndex = `${isMaximized ? '51' : '24'}`;
                    lineTooltipEl.appendChild(lineContent);
                    barTooltipEl.appendChild(barContent);

                    const canvasRect = chart.canvas.getBoundingClientRect();
                    const lastPoint = tooltip.dataPoints.at(-1)?.element;

                    if (!lastPoint) {
                        return;
                    }

                    const hoveredDataPoint = tooltip.dataPoints[0];
                    const datasetIndex = hoveredDataPoint.datasetIndex;
                    const dataIndex = hoveredDataPoint.dataIndex;
                    const isLastDataPoint =
                        dataIndex ===
                        chart.data.datasets[datasetIndex].data.length - 1;

                    // Line tooltip positioning
                    lineTooltipEl.style.opacity = '1';
                    lineTooltipEl.style.left = `${
                        canvasRect.left +
                        window.scrollX +
                        lastPoint.x +
                        (isLastDataPoint ? -160 : 50)
                    }px`;
                    lineTooltipEl.style.top = `${
                        canvasRect.top + window.scrollY + lastPoint.y - 30
                    }px`;

                    if (selectedTimeScales.length < 1) {
                        lineTooltipEl.style.left = `${tooltip.caretX}px`;
                        lineTooltipEl.style.top = `${tooltip.caretY}px`;
                        barTooltipEl.remove();
                        return;
                    }

                    // Bar tooltip positioning
                    if (tooltip.dataPoints.length > 1) {
                        const lineChartHeight = chart.canvas.clientHeight;

                        barTooltipEl.style.opacity = '1';
                        barTooltipEl.style.left = `${
                            canvasRect.left +
                            window.scrollX +
                            lastPoint.x +
                            (isLastDataPoint ? -160 : 60)
                        }px`;

                        barTooltipEl.style.top = `${
                            canvasRect.top +
                            window.scrollY +
                            lineChartHeight +
                            60
                        }px`;
                    } else {
                        barTooltipEl.style.opacity = '0';
                    }
                },
            },
        },
    };

    const handleDownload = async (
        refToUse: React.RefObject<HTMLDivElement>
    ) => {
        if (!refToUse.current) return;

        const lineTooltipElement =
            document.getElementById('chart-tooltip-line');
        const barTooltipElement = document.getElementById('chart-tooltip-bar');

        const clonedElements: HTMLElement[] = [];

        const cloneAndAppend = (element: HTMLElement | null) => {
            if (element) {
                const clonedTooltip = element.cloneNode(true) as HTMLElement;
                refToUse.current?.appendChild(clonedTooltip);
                clonedElements.push(clonedTooltip);

                const originalTop =
                    element.getBoundingClientRect().top + window.scrollY;
                const originalLeft =
                    element.getBoundingClientRect().left + window.scrollX;

                const parentTop =
                    (refToUse.current?.getBoundingClientRect()?.top ?? 0) +
                    window.scrollY;
                const parentLeft =
                    (refToUse.current?.getBoundingClientRect()?.left ?? 0) -
                    40 +
                    window.scrollX;

                const newTop = originalTop - parentTop;
                const newLeft = originalLeft - parentLeft;

                clonedTooltip.style.position = 'absolute';
                clonedTooltip.style.top = `${newTop}px`;
                clonedTooltip.style.left = `${newLeft}px`;
                clonedTooltip.style.opacity = '1';
            }
        };

        cloneAndAppend(lineTooltipElement);
        if (barTooltipElement?.style.opacity !== '0') {
            cloneAndAppend(barTooltipElement);
        }

        try {
            const dataUrl = await domtoimage.toPng(refToUse.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'Yield-Curve.png';
            link.click();
        } finally {
            clonedElements.forEach(el => el.remove());
        }
    };

    useTooltipVisibility(isMaximized);

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    const containerClasses = `
    ${
        isMaximized
            ? 'fixed inset-0 z-50 h-full w-full p-3'
            : 'relative h-[410px] w-full'
    }
    bg-neutral-900 overflow-hidden
`;

    const lineChartHeight =
        selectedTimeScales.length > 1
            ? isMaximized
                ? 'h-[50%]'
                : 'h-[12rem]'
            : isMaximized
            ? 'h-[70%]'
            : 'h-[20rem]';
    return (
        <div className={containerClasses} ref={componentRef}>
            <div className='flex justify-between px-2 py-1'>
                <TimeScaleSelector
                    selected={selectedTimeScales}
                    setSelected={setSelectedTimeScales}
                    length={Object.keys(HistoricalYieldIntervals).length}
                />
                <div className='flex flex-row gap-2'>
                    <button
                        onClick={toggleMaximize}
                        data-testid='toggleMaximize'
                        className='flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700'
                    >
                        {isMaximized ? (
                            <ArrowsPointingInIcon className='h-5 w-5 text-[#B9BDEA]' />
                        ) : (
                            <ArrowsPointingOutIcon className='h-5 w-5 text-[#B9BDEA]' />
                        )}
                    </button>
                    <button
                        onClick={() => handleDownload(componentRef)}
                        data-testid='handleDownloadBtn'
                        className='flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700'
                    >
                        <ArrowDownTrayIcon className='h-5 w-5 text-[#B9BDEA]' />
                    </button>
                </div>
            </div>
            <div className={`${lineChartHeight} w-full`}>
                {rates && (
                    <MultiLineChart
                        type='line'
                        data={data}
                        maturityList={maturityList}
                        options={chartOptions}
                        handleChartClick={maturityIndex => {
                            const { maturity, label, isPreOrderPeriod } =
                                maturityList[maturityIndex];
                            dispatch(setMaturity(maturity));
                            trackButtonEvent(
                                ButtonEvents.TERM_CHANGE,
                                ButtonProperties.TERM,
                                label
                            );
                            const market = `${currency}-${label}`;
                            let pathname = '/';
                            if (isPreOrderPeriod) {
                                pathname = '/itayose';
                            }
                            router.push({
                                pathname,
                                query: {
                                    market,
                                },
                            });
                        }}
                        maturity={new Maturity(maturity)}
                    />
                )}
            </div>
            {selectedTimeScales.length > 1 && (
                <div
                    className={clsx(
                        'flex flex-col border-t border-[#5b7280]',
                        isMaximized ? 'h-[40%]' : 'h-[125px]',
                        'w-full'
                    )}
                >
                    <span className='mb-[-10px] ml-2 pt-1 font-numerical text-[11px] text-neutral-400'>
                        Yield Spread
                    </span>
                    <BarChart
                        rates={historicalRates}
                        maturityList={maturityList.map(item => item.label)}
                    />
                </div>
            )}
        </div>
    );
};

type MaturityListItem = {
    label: string;
    maturity: number;
    isPreOrderPeriod: boolean;
};

const useTooltipVisibility = (isMaximized: boolean) => {
    useEffect(() => {
        const tooltips = [
            document.getElementById('chart-tooltip-line'),
            document.getElementById('chart-tooltip-bar'),
        ];

        tooltips.forEach(tooltip => {
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        });
        document.body.style.overflow = isMaximized ? 'hidden' : 'scroll';
    }, [isMaximized]);
};
