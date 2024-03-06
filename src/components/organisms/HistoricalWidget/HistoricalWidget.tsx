import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RadioButton } from 'src/components/atoms';
import { HistoricalChart } from 'src/components/molecules/HistoricalChart';
import { useGraphClientHook } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';
import { timeScales } from './constants';

type Transaction = {
    average: string;
    close: string;
    currency: string;
    high: string;
    interval: string;
    low: string;
    maturity: string;
    open: string;
    timestamp: string;
    volume: string;
    volumeInFV: string;
};

export const HistoricalWidget = () => {
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const [selectedTimeScale, setSelectedTimeScale] =
        useState<HistoricalDataIntervals>(HistoricalDataIntervals['15M']);

    const historicalTradeData = useGraphClientHook(
        {
            interval: selectedTimeScale,
            currency: toBytes32(currency),
            maturity: maturity,
            first: 1000,
            skip: 0,
        },
        queries.TransactionCandleStickDocument
    );

    const data = useMemo(() => {
        return (historicalTradeData.data?.transactionCandleSticks || []).map(
            (item: Transaction) => {
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
    }, [selectedTimeScale, historicalTradeData]);

    const onTimeScaleChange = (time: string) => {
        setSelectedTimeScale(time as HistoricalDataIntervals);
    };

    return (
        <>
            <div
                data-testid='timescale-selector'
                className='flex justify-between border-b border-t border-neutral-2 bg-[#292D3F99] px-4 py-2'
            >
                <RadioButton
                    options={timeScales}
                    value={selectedTimeScale}
                    onChange={(time: string) => onTimeScaleChange(time)}
                />
            </div>
            <HistoricalChart data={data} timeScale={selectedTimeScale} />
        </>
    );
};
