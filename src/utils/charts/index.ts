import { createChart } from 'lightweight-charts';

// export interface TradingData {
//     time: number;
//     open: number;
//     high: number;
//     low: number;
//     close: number;
//     vol: number;
// }

const commonOptions = {
    autoSize: true,
    layout: {
        background: { color: '#052132' },
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
    },
    crosshair: {
        mode: 1,
        vertLine: {
            color: 'rgba(230, 232, 236, 1)',
            labelBackgroundColor: '#5162FF',
        },
        horzLine: {
            color: 'rgba(230, 232, 236, 1)',
            labelBackgroundColor: '#5162FF',
        },
    },
};

// add line chart properties
// handle data structure for line chart

export const createPriceChart = (ref: HTMLDivElement) => {
    const chart = createChart(ref, {
        ...commonOptions,
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

    const lineChartSeries = chart.addLineSeries({
        color: '#5162FF',
        priceFormat: {
            type: 'volume',
        },
        lineWidth: 2,
    });
    return { chart, lineChartSeries };
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
        rightPriceScale: {
            ...commonOptions.rightPriceScale,
            scaleMargins: {
                top: 0.3,
                bottom: 0,
            },
        },
        timeScale: {
            visible: true,
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
