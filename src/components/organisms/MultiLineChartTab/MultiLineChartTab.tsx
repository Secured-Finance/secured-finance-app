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
import { Spinner } from 'src/components/atoms';
import BarChart from 'src/components/molecules/BarChart/BarChart';
import {
    getMultiLineChartData,
    MultiLineChart,
    multiLineChartOptions,
} from 'src/components/molecules/MultiLineChart';
import TimeScaleSelector from 'src/components/molecules/TimeScaleSelector/TimeScaleSelector';
import { useIsGlobalItayose } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalYieldIntervals } from 'src/types';
import { ButtonEvents, ButtonProperties, currencyMap, Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';
import {
    cloneAndAppend,
    createTooltipElement,
    generateTooltipContent,
    positionElement,
    useTooltipVisibility,
} from './constant';

export const MultiLineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
    fetchedRates,
    loading,
}: {
    rates: Rate[];
    maturityList: MaturityListItem[];
    itayoseMarketIndexSet: Set<number>;
    followLinks?: boolean;
    maximumRate: number;
    marketCloseToMaturityOriginalRate: number;
    fetchedRates: Record<HistoricalYieldIntervals, Rate[]> | undefined;
    loading: boolean;
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

    const data = getMultiLineChartData(
        historicalRates,
        'Market price',
        maturityList.map(item => item.label),
        itayoseMarketIndexSet,
        itayoseBorderColor
    );

    const chartOptions: ChartOptions<'line'> = {
        ...multiLineChartOptions,
        scales: {
            ...multiLineChartOptions.scales,
            y: {
                ...multiLineChartOptions.scales?.y,
                position: 'left',
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
                    lineTooltipEl.appendChild(lineContent);
                    barTooltipEl.appendChild(barContent);

                    const zIndex = isMaximized ? '51' : '24';
                    lineTooltipEl.style.zIndex = zIndex;
                    barTooltipEl.style.zIndex = zIndex;

                    const canvasRect = chart.canvas.getBoundingClientRect();
                    const lastPoint = tooltip.dataPoints.at(-1)?.element;

                    if (!lastPoint) return;

                    const hoveredDataPoint = tooltip.dataPoints[0];
                    const { datasetIndex, dataIndex } = hoveredDataPoint;
                    const dataset = chart.data.datasets[datasetIndex] as {
                        data: number[];
                    };

                    const isLastDataPoint =
                        dataIndex === dataset.data.length - 1;
                    // Position Line Tooltip
                    positionElement(
                        lineTooltipEl,
                        canvasRect.left +
                            lastPoint.x +
                            window.scrollX +
                            (isLastDataPoint ? -160 : 50),
                        window.scrollY + canvasRect.top + lastPoint.y - 30
                    );

                    if (selectedTimeScales.length < 1) {
                        positionElement(
                            lineTooltipEl,
                            tooltip.caretX,
                            tooltip.caretY
                        );
                        barTooltipEl.remove();
                        return;
                    }

                    // Position Bar Tooltip
                    if (tooltip.dataPoints.length > 1) {
                        const lineChartHeight = chart.canvas.clientHeight;
                        positionElement(
                            barTooltipEl,
                            window.scrollX + canvasRect.left + lastPoint.x + 50,
                            window.scrollY +
                                canvasRect.top +
                                lineChartHeight +
                                30
                        );
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

        const tooltips = [
            document.getElementById('chart-tooltip-line'),
            selectedTimeScales.length === 1
                ? null
                : document.getElementById('chart-tooltip-bar'),
        ];
        const clonedElements: HTMLElement[] = [];

        tooltips.forEach(el => el && (el.style.opacity = '0'));
        tooltips.forEach(el => cloneAndAppend(el, refToUse, clonedElements));

        try {
            clonedElements.forEach(el => (el.style.opacity = '1'));
            const timestamp = new Date()
                .toISOString()
                .replace(/[:T]/g, '-')
                .split('.')[0];
            const filename = `${currency}_YieldCurve_${timestamp}.png`;
            const dataUrl = await domtoimage.toPng(refToUse.current);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            link.click();
        } finally {
            tooltips.forEach(el => el && (el.style.opacity = '1'));
            clonedElements.forEach(el => el.remove());
        }
    };

    useTooltipVisibility(isMaximized, true);

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    const lineChartHeight =
        selectedTimeScales.length > 1
            ? isMaximized
                ? 'h-[50%]'
                : 'h-[12rem]'
            : isMaximized
            ? 'h-[70%]'
            : 'h-[20rem]';
    return loading ? (
        <div className='flex h-full w-full items-center justify-center'>
            <Spinner />
        </div>
    ) : (
        <div
            className={clsx('w-full overflow-hidden bg-neutral-900', {
                'fixed inset-0 z-50 h-full p-3': isMaximized,
                'relative h-[410px]': !isMaximized,
            })}
            ref={componentRef}
        >
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
                {rates && historicalRates && (
                    <MultiLineChart
                        type='line'
                        data={data}
                        maturityList={maturityList}
                        options={chartOptions}
                        selectedTimeScales={selectedTimeScales}
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
                        isMaximised={isMaximized}
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
