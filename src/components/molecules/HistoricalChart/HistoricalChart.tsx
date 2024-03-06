import { getUTCMonthYear } from '@secured-finance/sf-core';
import clsx from 'clsx';
import {
    CandlestickData,
    HistogramData,
    IChartApi,
    ISeriesApi,
    LogicalRange,
    MouseEventParams,
    Time,
    UTCTimestamp,
    WhitespaceData,
} from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBreakpoint, useLastPrices } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalDataIntervals } from 'src/types';
import { createCandlestickChart, createVolumeChart } from 'src/utils/charts';

export interface ITradingData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
}

export interface HistoricalChartProps {
    data: ITradingData[];
    timeScale?: HistoricalDataIntervals;
}

type TSeries = ISeriesApi<
    'Line' | 'Area' | 'Histogram' | 'Candlestick' | 'Bar'
>;

function getCrosshairDataPoint(series: TSeries, param: MouseEventParams) {
    if (!param.time) {
        return null;
    }
    const dataPoint = param.seriesData.get(series);
    return dataPoint || null;
}

function syncCrosshair(
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
    timeScale = HistoricalDataIntervals['15M'],
}: HistoricalChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const secondContainerRef = useRef<HTMLDivElement>(null);
    const [hoverTime, setHoverTime] = useState('');
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
                color: item.open > item.close ? '#FF9FAE' : '#09A8B7',
            }));

            candlestickSeries.setData(candleData);
            volumeSeries.setData(volumeData);
        },
        [data]
    );

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
                        (item: Record<'time', Time>) => item.time === param.time
                    );
            }

            const candleData = candlestickSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            const mergeData = {
                ...candleData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const date = new Date(Number(candleData?.time) * 1000);
            const formattedDate = `${date.getFullYear()}/${(
                '0' +
                (date.getMonth() + 1)
            ).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
            setHoverTime(formattedDate);

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
                usdVol: `${usdPrice * mergeData.value}`,
            });
        };

        candleStickChart.subscribeCrosshairMove(function (param) {
            const dataPoint = getCrosshairDataPoint(candlestickSeries, param);
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

        volumeChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
            candleStickChart
                .timeScale()
                .setVisibleLogicalRange(range as LogicalRange);
        });
    };

    useEffect(() => {
        if (!chartContainerRef.current || !secondContainerRef.current) return;
        const { candlestickSeries, chart: candleStickChart } =
            createCandlestickChart(chartContainerRef.current);

        const { volumeSeries, chart: volumeChart } = createVolumeChart(
            secondContainerRef.current,
            timeScale
        );

        setupCharts(candlestickSeries, volumeSeries);

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

            const candleData = candlestickSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            if (sourceChart === 'candlestick') {
                syncCrosshair(volumeChart, volumeSeries, candleData);
            } else {
                syncCrosshair(candleStickChart, candlestickSeries, volumeData);
            }
            const mergeData = {
                ...candleData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const date = new Date(Number(candleData?.time) * 1000);
            const formattedDate = `${date.getFullYear()}/${(
                '0' +
                (date.getMonth() + 1)
            ).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;

            setHoverTime(formattedDate);

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
                usdVol: `${usdPrice * mergeData.value}`,
            });
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
            setHoverTime('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, setupCharts, timeScale]);

    const titleOfChartClass =
        'z-10 flex gap-4 text-2xs text-neutral-4 font-medium leading-4 pt-[0.375rem] px-4';
    return (
        <div className='bg-neutral-900 pt-[0.625rem]'>
            <div className={clsx(titleOfChartClass)}>
                {hoverTime && <span>{hoverTime}</span>}
                {Object.entries(legendData)
                    .filter(([key, _]) => legendArray.includes(key))
                    .map(([key, value]) => {
                        return (
                            <div key={key} className='flex gap-1'>
                                <span className='text-neutral-4'>{key}</span>
                                <div
                                    className={clsx('font-normal', {
                                        'text-[#F5F6FF]': key !== 'Change',
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
                className='relative h-[297px] w-full'
            ></div>
            <div className={clsx(titleOfChartClass)}>
                <div>
                    <span>{VOLUME_KEY_NAME}:</span>
                    {legendData.VOLUME_KEY_NAME && (
                        <span className='ml-[0.375rem] text-galacticOrange'>
                            {legendData.VOLUME_KEY_NAME}
                        </span>
                    )}
                </div>
                <div>
                    <span>Vol(USDT):</span>
                    {legendData.usdVol && (
                        <span className='ml-[0.375rem] text-galacticOrange'>
                            {Number(legendData.usdVol).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            <div
                ref={secondContainerRef}
                data-testid='volume-chart'
                className='relative h-[144px] w-full'
            ></div>
        </div>
    );
}
