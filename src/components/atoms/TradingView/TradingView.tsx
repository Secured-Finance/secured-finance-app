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
import ButtonSelect from './ButtonSelect';
import { createCanlestickChart, createVolumeChart } from './utils';

export interface TradingData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
}

export interface TradingviewProps {
    data: TradingData[];
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

export function TradingView({ data, className }: TradingviewProps) {
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
                color: item.open > item.close ? '#74474E' : '#005962',
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
            } as Omit<TradingData, 'vol'> & { value: number };

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

        // crosshair sync , topMove , bottomMove
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

        // time scale sync
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

        volumeChart.timeScale().fitContent();
        candleStickChart.timeScale().fitContent();

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
            // const volumeData = param.seriesData.get(volumeSeries);
            if (sourceChart === 'candlestick') {
                syncCrosshair(volumeChart, volumeSeries, candleData);
            } else if (sourceChart === 'volume') {
                syncCrosshair(candleStickChart, candlestickSeries, volumeData);
            }
            const mergeData = {
                ...candleData,
                ...volumeData,
            } as Omit<TradingData, 'vol'> & { value: number };

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

    const options = [
        {
            label: '1M',
            value: '1m',
        },
        {
            label: '15M',
            value: '15M',
        },
        {
            label: '1H',
            value: '1H',
        },
        {
            label: '4H',
            value: '4H',
        },
        {
            label: '1D',
            value: '1D',
        },
        {
            label: '1W',
            value: '1W',
        },
        {
            label: '1M',
            value: '1M',
        },
    ];

    const graphOptions = [
        {
            label: 'MACD',
            value: 'MACD',
        },
        {
            label: 'VOL',
            value: 'VOL',
        },
        {
            label: 'KDL',
            value: 'KDL',
        },
    ];

    const [time, setTime] = useState('4H');
    const [graph, setGraph] = useState('VOL');

    return (
        <div className={classNames(className)}>
            <div className='flex justify-between border-b border-t border-neutral-2 bg-[#292D3F99] p-4'>
                <ButtonSelect
                    options={options}
                    value={time}
                    onChange={v => setTime(v)}
                />
                <ButtonSelect
                    options={graphOptions}
                    value={graph}
                    onChange={v => setGraph(v)}
                />
            </div>
            <div ref={chartContainerRef} className='relative h-full w-full'>
                <div className={titleOfChartClass}>
                    <div>{hoverTime}</div>
                    {Object.entries(legendData)
                        .filter(([key, _]) =>
                            ['O', 'H', 'L', 'C', 'Change'].includes(key)
                        ) // 过滤出需要的键
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
