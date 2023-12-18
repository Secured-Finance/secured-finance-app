import classNames from 'classnames';
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
import { createCanlestickChart, createVolumeChart } from 'src/utils/charts';

export interface ITradingData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
}

export interface HistoricalChartProps {
    data: ITradingData[];
    className?: string;
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

export function HistoricalChart({ data, className }: HistoricalChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const secondContianerRef = useRef<HTMLDivElement>(null);
    const [hoverTime, setHoverTime] = useState('');
    const [legendData, setLegendData] = useState({
        O: '',
        H: '',
        L: '',
        C: '',
        'Vol(BTC)': '',
        Change: '',
    });

    const setupCharts = useCallback(
        (candlestickSeries: TSeries, volumeSeries: TSeries) => {
            volumeSeries.applyOptions({ baseLineVisible: false });

            const candleData = data.map(item => ({
                time: Math.floor(item.time / 1000) as UTCTimestamp,
                open: Number(item.open),
                high: Number(item.high),
                low: Number(item.low),
                close: Number(item.close),
            }));

            const volumeData = data.map(item => ({
                time: Math.floor(item.time / 1000) as UTCTimestamp,
                value: Number(item.vol),
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
            const formattedDate =
                date.getFullYear() +
                '/' +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                '/' +
                ('0' + date.getDate()).slice(-2);
            setHoverTime(formattedDate);

            setLegendData({
                O: `${(mergeData?.open / 1000).toFixed(2)}K`,
                H: `${(mergeData?.high / 1000).toFixed(2)}K`,
                L: `${(mergeData?.low / 1000).toFixed(2)}K`,
                C: `${(mergeData?.close / 1000).toFixed(2)}K`,
                'Vol(BTC)': mergeData?.value?.toFixed(2),
                Change: `${(
                    ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                    100
                ).toFixed(2)}%`,
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
        if (!chartContainerRef.current || !secondContianerRef.current) return;
        const { candlestickSeries, chart: candleStickChart } =
            createCanlestickChart(chartContainerRef.current);

        const { volumeSeries, chart: volumeChart } = createVolumeChart(
            secondContianerRef.current
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
            } else if (sourceChart === 'volume') {
                syncCrosshair(candleStickChart, candlestickSeries, volumeData);
            }
            const mergeData = {
                ...candleData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const date = new Date(Number(candleData?.time) * 1000);
            const formattedDate =
                date.getFullYear() +
                '/' +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                '/' +
                ('0' + date.getDate()).slice(-2);
            setHoverTime(formattedDate);

            setLegendData({
                O: `${(mergeData?.open / 1000).toFixed(2)}K`,
                H: `${(mergeData?.high / 1000).toFixed(2)}K`,
                L: `${(mergeData?.low / 1000).toFixed(2)}K`,
                C: `${(mergeData?.close / 1000).toFixed(2)}K`,
                'Vol(BTC)': mergeData?.value?.toFixed(2),
                Change: `${(
                    ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                    100
                ).toFixed(2)}%`,
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
        };
    }, [data, setupCharts]);

    const titleOfChartClass =
        'absolute left-4 top-4 z-50 flex gap-4 text-2xs text-neutral-4 font-medium leading-4';

    return (
        <div className={classNames(className)}>
            <div ref={chartContainerRef} className='relative h-full w-full'>
                <div className={classNames(titleOfChartClass, 'relative mb-2')}>
                    <div>{hoverTime}</div>
                    {Object.entries(legendData)
                        .filter(([key, _]) =>
                            ['O', 'H', 'L', 'C', 'Change'].includes(key)
                        )
                        .map(([key, value]) => (
                            <div key={key} className='flex gap-1'>
                                <div>{key}</div>
                                <div className='font-normal text-[#15D6E8]'>
                                    {value}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div
                ref={secondContianerRef}
                className={classNames(className, 'relative h-full w-full')}
            >
                <div className={classNames(titleOfChartClass, '-top-4')}>
                    <div>
                        <span>Vol(BTC):</span>
                        <span className='ml-2 text-[#FF9FAE]'>
                            {(Number(legendData['Vol(BTC)']) / 1000).toFixed(3)}
                            K
                        </span>
                    </div>
                    <div>
                        <span>Vol(USDT):</span>
                        <span className='text-[#FF9FAE] '></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
