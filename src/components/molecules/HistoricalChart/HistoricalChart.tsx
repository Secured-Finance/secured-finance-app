import { getUTCMonthYear } from '@secured-finance/sf-core';
import clsx from 'clsx';
import {
    CandlestickData,
    HistogramData,
    IChartApi,
    LogicalRange,
    MouseEventParams,
    Time,
    UTCTimestamp,
    WhitespaceData,
} from 'lightweight-charts';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TradingViewLogo from 'src/assets/img/tradingview-black-logo.svg';
import { useBreakpoint, useLastPrices } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalDataIntervals } from 'src/types';
import { createCandlestickChart, createVolumeChart } from 'src/utils/charts';
import tailwindConfig from 'tailwind.config';
import { HistoricalChartProps, ITradingData, TSeries } from './types';

const { colors } = tailwindConfig.theme;

function getCrosshairDataPoint(series: TSeries, param: MouseEventParams) {
    if (!param.time) {
        return null;
    }
    const dataPoint = param.seriesData.get(series);
    return dataPoint || null;
}

export function syncCrosshair(
    chart: IChartApi,
    series: TSeries,
    dataPoint:
        | WhitespaceData<Time>
        | HistogramData<Time>
        | CandlestickData<Time>
        | null
) {
    if (dataPoint) {
        chart.setCrosshairPosition(
            (dataPoint as HistogramData<Time>).value,
            dataPoint.time,
            series
        );
        return;
    }
    chart.clearCrosshairPosition();
}

export function HistoricalChart({
    data,
    timeScale = HistoricalDataIntervals['5M'],
}: HistoricalChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const secondContainerRef = useRef<HTMLDivElement>(null);
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const { data: prices } = useLastPrices();
    const usdPrice = prices[currency];
    const prettyMaturity = getUTCMonthYear(+maturity);
    const VOLUME_KEY_NAME = `Vol(${currency} ${prettyMaturity})`;
    const isMobile = useBreakpoint('tablet');
    const legendArray = isMobile
        ? ['H', 'L', 'Change']
        : ['O', 'H', 'L', 'C', 'Change'];

    const [legendData, setLegendData] = useState({
        O: '',
        H: '',
        L: '',
        C: '',
        VOLUME_KEY_NAME: '',
        Change: '',
        usdVol: '',
    });

    const setupCharts = useCallback(
        (candlestickSeries: TSeries, volumeSeries: TSeries) => {
            volumeSeries.applyOptions({
                baseLineVisible: false,
            });

            const candleData = data.map(item => ({
                time: Number(item.time) as UTCTimestamp,
                open: +item.open,
                high: +item.high,
                low: +item.low,
                close: +item.close,
            }));

            const volumeData = data.map(item => ({
                time: Number(item.time) as UTCTimestamp,
                value: +item.vol,
                color:
                    item.open > item.close
                        ? colors.galacticOrange
                        : colors.secondary['700'],
            }));

            candlestickSeries.setData(candleData);
            volumeSeries.setData(volumeData);
        },
        [data]
    );

    useEffect(() => {
        const handleDisplayLegend = (
            candleData: WhitespaceData<Time> | CandlestickData<Time> | null,
            volumeData: WhitespaceData<Time> | HistogramData<Time> | null
        ) => {
            const mergeData = {
                ...candleData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const isNegative = mergeData?.close < mergeData?.open;

            setLegendData({
                O: `${mergeData?.open.toFixed(2)}`,
                H: `${mergeData?.high.toFixed(2)}`,
                L: `${mergeData?.low.toFixed(2)}`,
                C: `${mergeData?.close.toFixed(2)}`,
                VOLUME_KEY_NAME: `${mergeData?.value}`,
                Change: `${(
                    ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                    100
                ).toFixed(2)}%`,
                usdVol: `${isNegative ? '-' : ''}${usdPrice * mergeData.value}`,
            });
        };

        const subscribeToChartEvents = (
            candleStickChart: IChartApi,
            volumeChart: IChartApi,
            candlestickSeries: TSeries,
            volumeSeries: TSeries
        ) => {
            const updateLegendData = (param: MouseEventParams<Time>) => {
                if (!param.seriesData.size) return;

                let index = 0;
                if (param.time) {
                    index = candlestickSeries
                        .data()
                        .findIndex(
                            (item: Record<'time', Time>) =>
                                item.time === param.time
                        );
                }

                if (index < 0) return;

                const candleData = candlestickSeries.dataByIndex(index);
                const volumeData = volumeSeries.dataByIndex(index);
                handleDisplayLegend(candleData, volumeData);
            };

            candleStickChart.subscribeCrosshairMove(function (param) {
                const dataPoint = getCrosshairDataPoint(
                    candlestickSeries,
                    param
                );
                syncCrosshair(volumeChart, volumeSeries, dataPoint);
                updateLegendData(param);
            });

            volumeChart.subscribeCrosshairMove(function (param) {
                const dataPoint = getCrosshairDataPoint(volumeSeries, param);
                syncCrosshair(candleStickChart, candlestickSeries, dataPoint);
                updateLegendData(param);
            });

            candleStickChart
                .timeScale()
                .subscribeVisibleLogicalRangeChange(range => {
                    volumeChart
                        .timeScale()
                        .setVisibleLogicalRange(range as LogicalRange);
                });

            volumeChart
                .timeScale()
                .subscribeVisibleLogicalRangeChange(range => {
                    candleStickChart
                        .timeScale()
                        .setVisibleLogicalRange(range as LogicalRange);
                });
        };

        if (!chartContainerRef.current || !secondContainerRef.current) return;
        const { candlestickSeries, chart: candleStickChart } =
            createCandlestickChart(chartContainerRef.current, isMobile);

        candlestickSeries.applyOptions({
            borderVisible: true,
            borderUpColor: colors.secondary['700'],
            borderDownColor: colors.galacticOrange,
        });

        const { volumeSeries, chart: volumeChart } = createVolumeChart(
            secondContainerRef.current,
            timeScale,
            isMobile
        );

        setupCharts(candlestickSeries, volumeSeries);

        if (data.length > 0) {
            const chartWidth = chartContainerRef.current?.clientWidth;
            const targetBarSpacing = chartWidth / 30;

            candleStickChart.timeScale().applyOptions({
                barSpacing: targetBarSpacing,
            });
        }

        subscribeToChartEvents(
            candleStickChart,
            volumeChart,
            candlestickSeries,
            volumeSeries
        );

        volumeChart.timeScale();
        candleStickChart.timeScale();

        const updateTitleData = (
            param: MouseEventParams<Time>,
            sourceChart: string
        ) => {
            if (!param.seriesData.size) return;

            let index = 0;
            if (param.time) {
                index = candlestickSeries
                    .data()
                    .findIndex(
                        (item: Record<'time', Time>) => item.time === param.time
                    );
            }

            if (index < 0) return;

            const candleData = candlestickSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            if (sourceChart === 'candlestick') {
                syncCrosshair(volumeChart, volumeSeries, candleData);
            } else {
                syncCrosshair(candleStickChart, candlestickSeries, volumeData);
            }

            handleDisplayLegend(candleData, volumeData);
        };

        candleStickChart.subscribeCrosshairMove(function (param) {
            updateTitleData(param, 'candlestick');
        });

        volumeChart.subscribeCrosshairMove(function (param) {
            updateTitleData(param, 'volume');
        });

        return () => {
            candleStickChart.remove();
            volumeChart.remove();
            setLegendData({
                O: '',
                H: '',
                L: '',
                C: '',
                VOLUME_KEY_NAME: '',
                Change: '',
                usdVol: '',
            });
        };
    }, [data, setupCharts, timeScale, usdPrice, isMobile]);

    const titleOfChartClass =
        'z-10 flex gap-4 text-2xs text-neutral-4 font-medium text-[11px] tablet:text-xs leading-4 pt-2 laptop:pt-1.5 px-4';

    return (
        <div
            className='relative bg-neutral-900 pt-1 font-tertiary laptop:pt-2.5'
            data-chromatic='ignore'
        >
            <div className={clsx(titleOfChartClass)}>
                {Object.entries(legendData)
                    .filter(([key, _]) => legendArray.includes(key))
                    .map(([key, value]) => {
                        return (
                            <div key={key} className='flex gap-1'>
                                <span
                                    className={clsx('text-neutral-4', {
                                        'hidden laptop:block': key === 'Change',
                                    })}
                                >
                                    {key}
                                </span>
                                <div
                                    className={clsx('font-normal', {
                                        'text-primary-50': key !== 'Change',
                                        'text-nebulaTeal':
                                            key === 'Change' &&
                                            !value.includes('-'),
                                        'text-galacticOrange':
                                            key === 'Change' &&
                                            value.includes('-'),
                                    })}
                                >
                                    {value}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div
                ref={chartContainerRef}
                data-testid='candlestick-chart'
                className='relative h-[156px] w-full laptop:h-[184px]'
            />
            <div className={clsx(titleOfChartClass)}>
                <div>
                    <span>{VOLUME_KEY_NAME}:</span>
                    {legendData.VOLUME_KEY_NAME && (
                        <span
                            className={clsx('ml-[0.375rem]', {
                                'text-galacticOrange':
                                    legendData.usdVol.includes('-'),
                                'text-nebulaTeal':
                                    !legendData.usdVol.includes('-'),
                            })}
                        >
                            {legendData.VOLUME_KEY_NAME}
                        </span>
                    )}
                </div>
                <div>
                    <span>Vol(USDT):</span>
                    {legendData.usdVol && (
                        <span
                            className={clsx('ml-[0.375rem]', {
                                'text-galacticOrange':
                                    legendData.usdVol.includes('-'),
                                'text-nebulaTeal':
                                    !legendData.usdVol.includes('-'),
                            })}
                        >
                            {Math.abs(Number(legendData.usdVol)).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            <div
                ref={secondContainerRef}
                data-testid='volume-chart'
                className='relative h-[92px] w-full laptop:h-[115px]'
            ></div>

            <Link
                href='https://www.tradingview.com/'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Visit TradingView website'
                className='absolute bottom-3 left-3 z-10 overflow-hidden rounded-full'
            >
                <TradingViewLogo className='h-8 w-8' />
            </Link>
        </div>
    );
}
