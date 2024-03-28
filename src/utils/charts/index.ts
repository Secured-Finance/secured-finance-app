import { createChart } from 'lightweight-charts';
import { HistoricalDataIntervals } from 'src/types';
import tailwindConfig from 'tailwind.config';

const intervalsToCheck = ['300', '900', '1800', '3600', '14400'];

const { colors } = tailwindConfig.theme;

const commonOptions = {
    autoSize: true,
    layout: {
        background: { color: '#052132' },
        textColor: colors.slateGray,
    },
    grid: {
        vertLines: {
            visible: false,
        },
        horzLines: {
            color: colors.neutral['700'],
        },
    },
    rightPriceScale: {
        textColor: colors.neutral['300'],
        borderColor: colors.slateGray,
        borderVisible: false,
        minimumWidth: 58,
    },
    crosshair: {
        mode: 1,
        vertLine: {
            color: colors.neutral['300'],
            labelBackgroundColor: colors.neutral['600'],
        },
        horzLine: {
            color: colors.neutral['300'],
            labelBackgroundColor: colors.neutral['600'],
        },
    },
};

export const createCandlestickChart = (ref: HTMLDivElement) => {
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
        (
            ref.querySelector('canvas') as HTMLCanvasElement
        ).style.borderBottom = `2px solid ${colors.neutral['700']}`;
    }

    const candlestickSeries = chart.addCandlestickSeries({
        upColor: colors.nebulaTeal,
        downColor: colors.galacticOrange,
        borderVisible: false,
        wickUpColor: colors.nebulaTeal,
        wickDownColor: colors.galacticOrange,
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, candlestickSeries };
};

export const createVolumeChart = (
    ref: HTMLDivElement,
    timeInterval: HistoricalDataIntervals
) => {
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
            timeVisible: intervalsToCheck.includes(timeInterval as string),
        },
    });
    const volumeSeries = chart.addHistogramSeries({
        color: colors.secondary['700'],
        priceLineWidth: 1,
        priceLineVisible: true,
        priceFormat: {
            type: 'volume',
        },
    });
    return { chart, volumeSeries };
};
