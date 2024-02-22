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
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { createPriceChart, createVolumeChart } from 'src/utils/charts';

export interface ITradingData {
    time: number;
    value: number;
    vol: number;
}

export interface HistoricalChartProps {
    data: ITradingData[];
    className?: string;
}

// NOTE: leaving Candlestick here for when subgraph can handle the associated data structure
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
    const priceChartContainerRef = useRef<HTMLDivElement>(null);
    const volumeChartContainerRef = useRef<HTMLDivElement>(null);
    const [hoverTime, setHoverTime] = useState('');
    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const VOLUME_KEY_NAME = `Vol(${currency})`;
    const [legendData, setLegendData] = useState({
        // O: '',
        // H: '',
        // L: '',
        // C: '',
        VOLUME_KEY_NAME: '',
        Change: '',
    });

    const setupCharts = useCallback(
        (lineChartSeries: TSeries, volumeSeries: TSeries) => {
            volumeSeries.applyOptions({ baseLineVisible: false });

            const priceData = data.map(item => ({
                time: Math.floor(item.time / 1000) as UTCTimestamp,
                value: Number(item.value),
            }));

            const volumeData = data.map(item => ({
                time: Math.floor(item.time / 1000) as UTCTimestamp,
                value: Number(item.vol),
                color: '#09A8B7',
            }));

            lineChartSeries.setData(priceData);
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
                // O: `${(mergeData?.open / 1000).toFixed(2)}K`,
                // H: `${(mergeData?.high / 1000).toFixed(2)}K`,
                // L: `${(mergeData?.low / 1000).toFixed(2)}K`,
                // C: `${(mergeData?.close / 1000).toFixed(2)}K`,
                VOLUME_KEY_NAME: mergeData?.value?.toFixed(2),
                // Change: `${(
                //     ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                //     100
                // ).toFixed(2)}%`,
                Change: '0.00%',
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
        if (!priceChartContainerRef.current || !volumeChartContainerRef.current)
            return;
        const { lineChartSeries, chart: priceChart } = createPriceChart(
            priceChartContainerRef.current
        );

        const { volumeSeries, chart: volumeChart } = createVolumeChart(
            volumeChartContainerRef.current
        );

        setupCharts(lineChartSeries, volumeSeries);

        subscribeToChartEvents(
            priceChart,
            volumeChart,
            lineChartSeries,
            volumeSeries
        );

        priceChart.timeScale();
        volumeChart.timeScale();

        const updateTitleData = (
            param: MouseEventParams<Time>,
            sourceChart: string
        ) => {
            if (!param.seriesData.size) return;

            let index = 0;
            if (param.time) {
                index = lineChartSeries
                    .data()
                    .findIndex(
                        (item: Record<'time', Time>) => item.time === param.time
                    );
            }

            const candleData = lineChartSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            if (sourceChart === 'price') {
                syncCrosshair(volumeChart, volumeSeries, candleData);
            } else if (sourceChart === 'volume') {
                syncCrosshair(priceChart, lineChartSeries, volumeData);
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
                // O: `${(mergeData?.open / 1000).toFixed(2)}K`,
                // H: `${(mergeData?.high / 1000).toFixed(2)}K`,
                // L: `${(mergeData?.low / 1000).toFixed(2)}K`,
                // C: `${(mergeData?.close / 1000).toFixed(2)}K`,
                VOLUME_KEY_NAME: mergeData?.value?.toFixed(2),
                // TODO: handle change calculation
                // Change: `${(
                //     ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                //     100
                // ).toFixed(2)}%`,
                Change: `0.00%`,
            });
        };

        priceChart.subscribeCrosshairMove(function (param) {
            updateTitleData(param, 'price');
        });

        volumeChart.subscribeCrosshairMove(function (param) {
            updateTitleData(param, 'volume');
        });

        return () => {
            priceChart.remove();
            volumeChart.remove();
        };
    }, [data, setupCharts]);

    const titleOfChartClass =
        'z-10 flex gap-4 text-2xs text-neutral-4 font-medium leading-4 p-4';

    return (
        <div className={clsx(className, 'bg-neutral-900')}>
            <div className={clsx(titleOfChartClass, 'relative')}>
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
            {/* TODO: handle placement of chart title (within or outside of chart) */}
            <div
                ref={priceChartContainerRef}
                className='relative h-[260px] w-full'
            ></div>
            <div
                ref={volumeChartContainerRef}
                className={clsx(className, 'relative h-[170px] w-full')}
            >
                <div className={clsx(titleOfChartClass)}>
                    <div>
                        <span>{VOLUME_KEY_NAME}:</span>
                        <span className='ml-2 text-[#FF9FAE]'>
                            {(
                                Number(legendData.VOLUME_KEY_NAME) / 1000
                            ).toFixed(3)}
                            K
                        </span>
                    </div>
                    {/* TODO: confirm if we are showing USDT here */}
                    <div>
                        <span>Vol(USDT):</span>
                        <span className='text-[#FF9FAE]'></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
