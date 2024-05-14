import { ISeriesApi } from 'lightweight-charts';
import { HistoricalDataIntervals } from 'src/types';

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

export type TSeries = ISeriesApi<
    'Line' | 'Area' | 'Histogram' | 'Candlestick' | 'Bar'
>;
