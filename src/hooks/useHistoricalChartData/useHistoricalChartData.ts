import { useEffect, useState } from 'react';
import { historcialChartMockData } from 'src/components/organisms/HistoricalWidget/constants';

export const useHistoricalChartData = () => {
    const [selectTimeScale, setSlectTimeScale] = useState('4h');
    const [selectChartType, setSelectChartType] = useState('VOL');
    const [data, setData] = useState([]);
    const getBSCData = async (_: string) => {
        // const data = await fetch(
        //     `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${time}&limit=${limit}`
        // ).then(res => res.json());
        const result = historcialChartMockData.map(
            (item: (string | number)[]) => {
                return {
                    time: item[0] as string,
                    open: item[1] as string,
                    high: item[2] as string,
                    low: item[3] as string,
                    close: item[4] as string,
                    vol: item[5] as string,
                };
            }
        );
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
