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
            color: '#23262F',
            visible: false,
        },
        horzLines: {
            color: '#334155',
        },
    },
    rightPriceScale: {
        textColor: 'rgba(177, 181, 195, 1)',
        borderColor: 'rgba(119, 126, 144, 1)',
        borderVisible: false,
        // minimumWidth: 140,
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
                top: 0.2,
                bottom: 0.12,
            },
        },
    });
    if (ref.querySelector('canvas')) {
        (ref.querySelector('canvas') as HTMLCanvasElement).style.borderBottom =
            '2px solid #334155';
    }

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#15D6E8',
        downColor: '#FF9FAE',
        borderVisible: false,
        wickUpColor: '#15D6E8',
        wickDownColor: '#FF9FAE',
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, candlestickSeries };
};

export const createVolumeChart = (ref: HTMLDivElement) => {
    const chart = createChart(ref, {
        ...commonOptions,
        grid: {
            ...commonOptions.grid,
            vertLines: {
                visible: false,
            },
            horzLines: {
                visible: false,
            },
        },
        height: 170,
        rightPriceScale: {
            ...commonOptions.rightPriceScale,
            scaleMargins: {
                top: 0.3,
                bottom: 0,
            },
        },
        timeScale: {
            ticksVisible: true,
        },
    });
    const volumeSeries = chart.addHistogramSeries({
        color: '#09A8B7',
        priceLineWidth: 1,
        priceLineVisible: true,
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, volumeSeries };
};
