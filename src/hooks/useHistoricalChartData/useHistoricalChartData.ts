import { useEffect, useState } from 'react';
import { historicalChartMockData } from 'src/components/organisms/HistoricalWidget/constants';

type Candlestick = {
    id: string;
    interval: string;
    currency: string;
    maturity: string;
    timestamp: number;
    open: string;
    close: string;
    high: string;
    low: string;
    volume: number;
    lendingMarket: Record<string, never>; // Assuming lendingMarket is an empty object
};

export const useHistoricalChartData = () => {
    const [selectTimeScale, setSlectTimeScale] = useState('4h');
    const [selectChartType, setSelectChartType] = useState('VOL');
    const [data, setData] = useState([]);
    const getBSCData = async (_: string) => {
        const result = historicalChartMockData.map((item: Candlestick) => {
            return {
                time: item.timestamp.toString(),
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                vol: item.volume.toString(),
            };
        });
        setData(result as never[]);
    };

    const onChartTypeChange = (_: string, type: string) => {
        setSelectChartType(type);
    };

    const onTimeScaleChange = (time: string, _: string) => {
        setSlectTimeScale(time);
    };

    useEffect(() => {
        getBSCData(selectTimeScale);
    }, [selectTimeScale]);

    return {
        selectTimeScale,
        selectChartType,
        onChartTypeChange,
        onTimeScaleChange,
        data,
    };
};
