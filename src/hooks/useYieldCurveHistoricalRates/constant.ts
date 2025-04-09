import { HistoricalYieldIntervals } from 'src/types';
import { Rate } from 'src/utils';

export const mockRates: Record<HistoricalYieldIntervals, Rate[]> = {
    [HistoricalYieldIntervals['30M']]: [],
    [HistoricalYieldIntervals['1H']]: [],
    [HistoricalYieldIntervals['4H']]: [],
    [HistoricalYieldIntervals['1D']]: [],
    [HistoricalYieldIntervals['1W']]: [],
    [HistoricalYieldIntervals['1MTH']]: [],
};
