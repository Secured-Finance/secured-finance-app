import { HistoricalYieldIntervals } from 'src/types';

export const yieldTimeScales = Object.entries(HistoricalYieldIntervals).map(
    interval => ({
        label: interval[0],
        value: interval[1],
    }),
);

export const getColor = (index: number, opacity: number) => {
    const colors = [
        `rgba(63, 83, 211, ${opacity})`, // Blue
        `rgba(9, 168, 183, ${opacity})`, // Teal
        `rgba(203, 213, 225, ${opacity})`, // Soft Gray-Blue
        `rgba(237, 203, 255, ${opacity})`, // Light Purple
        `rgba(106, 117, 255, ${opacity})`, // Slightly lighter blue
        `rgba(11, 184, 199, ${opacity})`, // Vibrant teal
        `rgba(226, 232, 240, ${opacity})`, // Softer grayish-blue
        `rgba(242, 212, 255, ${opacity})`, // Pastel lavender
    ];
    return colors[index % colors.length];
};

export const timeScaleMapping: Record<string, string> = {
    '30M': '30 Minutes',
    '1H': '1 Hour',
    '4H': '4 Hours',
    '1D': '1 Day',
    '3D': '3 Days',
    '1W': '1 Week',
    '1MTH': '1 Month',
};

export const formatTimeLabel = (scale: string): string => {
    return timeScaleMapping[scale] || scale;
};
