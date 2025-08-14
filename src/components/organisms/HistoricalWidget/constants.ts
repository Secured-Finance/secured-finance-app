import { HistoricalDataIntervals } from 'src/types';

export const timeScales = Object.entries(HistoricalDataIntervals).map(
    interval => ({
        label: interval[0],
        value: interval[1],
    }),
);

export const graphTypeOptions = [
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
