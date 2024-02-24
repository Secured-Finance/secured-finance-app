import { useEffect, useState } from 'react';
import { ITradingData } from 'src/components/molecules/HistoricalChart';
import { historicalChartMockData } from 'src/components/organisms/HistoricalWidget/constants';

const timeframes = {
    // '6Hr': 6 * 60 * 60 * 1000,
    '1D': 24 * 60 * 60 * 1000,
    // '15Days': 15 * 24 * 60 * 60 * 1000,
    // '1Month': 30 * 24 * 60 * 60 * 1000,
    // '3Months': 3 * 30 * 24 * 60 * 60 * 1000,
};

// TODO: give types to trades and timeframe
// Function to calculate candlestick data for a given timeframe
// Group transactions by date

export const useHistoricalChartData = () => {
    const [selectTimeScale, setSelectTimeScale] = useState('6h');
    const [data, setData] = useState([]);

    const getHistoricalBondPrices = async (_timeScale: string) => {
        const result = historicalChartMockData
            // TODO: remove sort when querying by orderBy
            .sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
            .map(item => ({
                time: +item.createdAt,
                value: +item.orderPrice / 100,
                // TODO: replace with real volume
                vol: +item.orderPrice,
            }));

        const groupedByDate: {
            [key: string]: ITradingData[];
        } = {};

        result.forEach(transaction => {
            const date = new Date(transaction.time * 1000); // Convert timestamp to date
            const dateString = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD

            if (!groupedByDate[dateString]) {
                groupedByDate[dateString] = [];
            }

            groupedByDate[dateString].push(transaction);
        });
        // TODO: define data point here
        setData(groupedByDate as never);
    };

    const onTimeScaleChange = (time: string, _: string) => {
        setSelectTimeScale(time);
    };

    useEffect(() => {
        getHistoricalBondPrices(selectTimeScale);
    }, [selectTimeScale]);

    return {
        selectTimeScale,
        // selectChartType,
        // onChartTypeChange,
        onTimeScaleChange,
        data,
    };
};
