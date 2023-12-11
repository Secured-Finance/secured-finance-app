import { createChart } from 'lightweight-charts';
export interface TradingData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
}

const commonOptions = {
    // width: 800,
    height: 400,
    layout: {
        background: { color: '#18202a' },
        textColor: 'rgba(119, 126, 144, 1)',
    },
    grid: {
        vertLines: {
            color: '#23262F', // 将垂直线颜色设置为完全透明
        },
        horzLines: {
            color: '#23262F', // 将水平线颜色设置为完全透明
        },
    },
    rightPriceScale: {
        textColor: 'rgba(177, 181, 195, 1)',
        borderColor: 'rgba(119, 126, 144, 1)',
        borderVisible: true,
        minimumWidth: 100,
    },
    crosshair: {
        mode: 1,
        vertLine: {
            color: 'rgba(230, 232, 236, 1)',
        },
        horzLine: {
            color: 'rgba(230, 232, 236, 1)',
        },
    },
};

export const createCanlestickChart = (ref: HTMLDivElement) => {
    const chart = createChart(ref, {
        ...commonOptions,
        height: 260,
        timeScale: {
            visible: false,
        },
        rightPriceScale: {
            ...commonOptions.rightPriceScale,
            scaleMargins: {
                top: 0.1,
                bottom: 0.12,
            },
        },
    });
    if (ref.querySelector('canvas')) {
        (ref.querySelector('canvas') as HTMLCanvasElement).style.borderBottom =
            '1px solid #353945'; // 可以调整为所需的样式
    }

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: 'rgba(21, 214, 232, 1)',
        downColor: 'rgba(255, 159, 174, 1)',
        borderVisible: false,
        wickUpColor: 'rgba(21, 214, 232, 1)',
        wickDownColor: 'rgba(255, 159, 174, 1)',
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, candlestickSeries };
};

export const createVolumeChart = (ref: HTMLDivElement) => {
    const chart = createChart(ref, {
        ...commonOptions,
        height: 170,
        rightPriceScale: {
            ...commonOptions.rightPriceScale,
            scaleMargins: {
                top: 0.3,
                bottom: 0,
            },
        },
    });
    const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceLineWidth: 1,
        priceLineVisible: true,
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, volumeSeries };
};
