import { getUTCMonthYear } from '@secured-finance/sf-core';
import clsx from 'clsx';
import {
    CandlestickData,
    HistogramData,
    IChartApi,
    ISeriesApi,
    LineData,
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
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const prettyMaturity = getUTCMonthYear(+maturity);

    const VOLUME_KEY_NAME = `Vol(${currency} ${prettyMaturity})`;
    const [legendData, setLegendData] = useState({
        VOLUME_KEY_NAME: '',
        Change: '',
    });

    const setupCharts = useCallback(
        (lineChartSeries: TSeries, volumeSeries: TSeries) => {
            volumeSeries.applyOptions({ baseLineVisible: false });

            const priceData: LineData[] = [];
            const volumeData: HistogramData[] = [];

            data.forEach(value => {
                priceData.push({
                    time: Math.floor(value.time / 1000) as UTCTimestamp,
                    value: +value.value,
                });

                volumeData.push({
                    time: Math.floor(value.time / 1000) as UTCTimestamp,
                    value: +value.vol,
                    color: '#09A8B7',
                });
            });

            lineChartSeries.setData(priceData);
            volumeSeries.setData(volumeData);
        },
        [data]
    );

    const subscribeToChartEvents = (
        priceChart: IChartApi,
        volumeChart: IChartApi,
        priceSeries: TSeries,
        volumeSeries: TSeries
    ) => {
        const updateLegendData = (param: MouseEventParams<Time>) => {
            if (!param.seriesData.size) return;

            let index = 0;
            if (param.time) {
                index = priceSeries
                    .data()
                    .findIndex(
                        (item: Record<'time', Time>) => item.time === param.time
                    );
            }

            const priceData = priceSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            const mergeData = {
                ...priceData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const date = new Date(Number(priceData?.time) * 1000 * 1000);
            const formattedDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
            setHoverTime(formattedDate);

            setLegendData({
                VOLUME_KEY_NAME: mergeData?.value?.toFixed(2),
                Change: '1.00%',
            });
        };

        priceChart.subscribeCrosshairMove(function (param) {
            const dataPoint = getCrosshairDataPoint(priceSeries, param);
            syncCrosshair(volumeChart, volumeSeries, dataPoint);
            updateLegendData(param);
        });

        volumeChart.subscribeCrosshairMove(function (param) {
            const dataPoint = getCrosshairDataPoint(volumeSeries, param);
            syncCrosshair(priceChart, priceSeries, dataPoint);
            updateLegendData(param);
        });

        priceChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
            volumeChart
                .timeScale()
                .setVisibleLogicalRange(range as LogicalRange);
        });

        volumeChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
            priceChart
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

            const priceData = lineChartSeries.dataByIndex(index);
            const volumeData = volumeSeries.dataByIndex(index);
            if (sourceChart === 'price') {
                syncCrosshair(volumeChart, volumeSeries, priceData);
            } else if (sourceChart === 'volume') {
                syncCrosshair(priceChart, lineChartSeries, volumeData);
            }
            const mergeData = {
                ...priceData,
                ...volumeData,
            } as Omit<ITradingData, 'vol'> & { value: number };

            const date = new Date(Number(priceData?.time) * 1000 * 1000);
            const formattedDate = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
            setHoverTime(formattedDate);

            setLegendData({
                VOLUME_KEY_NAME: mergeData?.value?.toFixed(2),
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
        'z-10 flex gap-[0.375rem] text-2xs text-neutral-4 font-medium leading-4 pt-[0.375rem] px-4';

    return (
        <div className={clsx(className, 'bg-neutral-900 pt-[0.625rem]')}>
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
            <div className={clsx(titleOfChartClass)}>
                <div>
                    <span>{VOLUME_KEY_NAME}:</span>
                    <span className='ml-[0.375rem] text-[#FF9FAE]'>
                        {(Number(legendData.VOLUME_KEY_NAME) / 1000).toFixed(3)}
                        K
                    </span>
                </div>
                <div>
                    <span>Vol(USDT):</span>
                    <span className='text-[#FF9FAE]'></span>
                </div>
            </div>
            <div
                ref={volumeChartContainerRef}
                className={clsx(className, 'relative h-[170px] w-full')}
            ></div>
        </div>
    );
}
