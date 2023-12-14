import { useEffect, useState } from 'react';

export const useHistoricalChartData = () => {
    const [selectTimeScale, setSlectTimeScale] = useState('4h');
    const [selectChartType, setSelectChartType] = useState('VOL');
    const [data, setData] = useState([]);
    const getBSCData = async (time: string, limit = 1000) => {
        const data = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}&limit=${limit}`
        ).then(res => res.json());
        const result = data.map((item: Record<string, string>) => {
            return {
                time: item[0],
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                vol: item[5],
            };
        });
        setData(result);
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
