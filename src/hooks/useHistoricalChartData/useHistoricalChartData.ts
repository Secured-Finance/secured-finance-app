// import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { historicalChartMockData as historicalTradeData } from 'src/components/organisms/HistoricalWidget/constants';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';
// import { toBytes32 } from '@secured-finance/sf-graph-client';
// import { useGraphClientHook } from '../useGraphClientHook';

export interface HistoricalDataPoint {
    currency: string;
    maturity: string;
    interval: string;
    timestamp: string;
    open: string;
    close: string;
    high: string;
    low: string;
    average: string;
    volume: string;
    volumeInFV: string;
}

export const useHistoricalChartData = () => {
    const [selectedTimeScale, setSelectedTimeScale] =
        useState<HistoricalDataIntervals>(HistoricalDataIntervals['15M']);
    const [selectChartType, setSelectChartType] = useState('VOL');
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    // TODO: handle query name here
    // const historicalTradeData = useGraphClientHook(
    //     {
    //         interval: selectedTimeScale,
    //         currency: toBytes32(currency),
    //         maturity: maturity,
    //     },
    //     queries.FilteredUserOrderHistoryDocument,
    //     'user'
    // );

    const data = useMemo(() => {
        return (historicalTradeData.data?.transactionCandleSticks || []).map(
            (item: HistoricalDataPoint) => {
                const ccy = hexToCurrencySymbol(item.currency);
                const volAdjusted = amountFormatterFromBase[
                    ccy as CurrencySymbol
                ](BigInt(item.volume));

                return {
                    time: item.timestamp,
                    open: +item.open / 100,
                    high: +item.high / 100,
                    low: +item.low / 100,
                    close: +item.close / 100,
                    vol: volAdjusted,
                };
            }
        ); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTimeScale]);

    const onChartTypeChange = (_: string, type: string) => {
        setSelectChartType(type);
    };

    const onTimeScaleChange = (time: string) => {
        setSelectedTimeScale(time as HistoricalDataIntervals);
    };

    return {
        selectedTimeScale,
        selectChartType,
        onChartTypeChange,
        onTimeScaleChange,
        data,
    };
};
