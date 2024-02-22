import { useEffect, useState } from 'react';
import { historicalChartMockData } from 'src/components/organisms/HistoricalWidget/constants';

export const useHistoricalChartData = () => {
    const [selectTimeScale, setSelectTimeScale] = useState('4h');
    const [selectChartType, setSelectChartType] = useState('VOL');
    const [data, setData] = useState([]);
    const getBSCData = async (_timeScale: string) => {
        // NOTE: 'value' is replacing "close" as bond price
        const result = historicalChartMockData.map(
            (item: (string | number)[]) => {
                return {
                    time: item[0] as string,
                    value: item[4] as string,
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
        setSelectTimeScale(time);
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
