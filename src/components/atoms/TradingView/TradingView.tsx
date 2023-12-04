import classNames from 'classnames';
import { CrosshairMode, UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

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

export function TradingView({ data, className }: TradingviewProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [hoverTime, setHoverTime] = useState('');
    const [legendData, setLegendData] = useState({
        O: '',
        H: '',
        L: '',
        C: '',
        'Vol(BTC)': '',
        Change: '',
    });

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: 800,
            height: 400,
            layout: {
                background: { color: '#18202a' },
                textColor: 'rgba(119, 126, 144, 1)',
            },
            grid: {
                vertLines: {
                    color: '#24262e', // 将垂直线颜色设置为完全透明
                },
                horzLines: {
                    color: '24262e', // 将水平线颜色设置为完全透明
                },
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.3,
                },
                textColor: 'white',
                borderVisible: true,
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    color: 'rgba(230, 232, 236, 1)',
                },
                horzLine: {
                    color: 'rgba(230, 232, 236, 1)',
                },
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: 'rgba(21, 214, 232, 1)',
            downColor: 'rgba(255, 159, 174, 1)',
            borderVisible: false,
            wickUpColor: 'rgba(21, 214, 232, 1)',
            wickDownColor: 'rgba(255, 159, 174, 1)',
        });

        const volumeSeries = chart.addHistogramSeries({
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
        });

        chart.priceScale('').applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
            borderVisible: true,
        });

        volumeSeries.applyOptions({
            baseLineVisible: false,
        });

        const updateChart = async () => {
            try {
                const candleData = data.map(item => {
                    return {
                        time: Math.floor(item.time / 1000) as UTCTimestamp, // Ensure this is a number, representing a UTCTimestamp
                        open: Number(item.open),
                        high: Number(item.high),
                        low: Number(item.low),
                        close: Number(item.close),
                    };
                });
                const volumeData = data.map(item => {
                    return {
                        time: Math.floor(item.time / 1000) as UTCTimestamp,
                        value: Number(item.vol),
                        color:
                            item.open > item.close
                                ? 'rgba(116,71,78, 0.9)'
                                : 'rgba(0, 89, 89, 0.9)',
                    };
                });

                candlestickSeries.setData(candleData);
                volumeSeries.setData(volumeData);
                chart.timeScale().fitContent();
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            }
        };

        updateChart();

        chart.subscribeCrosshairMove(param => {
            if (!param.seriesData.size) return;

            const candleData = param.seriesData.get(candlestickSeries);
            const volumeData = param.seriesData.get(volumeSeries);
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
                'Vol(BTC)': mergeData?.value.toFixed(2),
                Change: `${(
                    ((mergeData?.close - mergeData?.open) / mergeData?.open) *
                    100
                ).toFixed(2)}%`,
            });
        });

        return () => chart.remove();
    }, [data]);

    return (
        <div
            ref={chartContainerRef}
            className={classNames(className, 'relative h-full w-full')}
        >
            <div className='absolute left-5 top-2 z-50 flex gap-4 text-2xs text-neutral-4 '>
                <div>{hoverTime}</div>
                {Object.entries(legendData).map(([key, value]) => (
                    <div key={key} className='flex gap-1'>
                        <div>{key}</div>
                        <div className='font-normal text-[#15D6E8]'>
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
