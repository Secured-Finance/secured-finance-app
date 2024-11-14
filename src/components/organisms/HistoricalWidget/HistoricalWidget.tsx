import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DropdownSelector, RadioButton } from 'src/components/atoms';
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
        useState<HistoricalDataIntervals>(HistoricalDataIntervals['5M']);

    const historicalTradeData = useGraphClientHook(
        {
            interval: selectedTimeScale,
            currency: toBytes32(currency),
            maturity: maturity,
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
        );
    }, [historicalTradeData]);

    const onTimeScaleChange = (time: string) => {
        setSelectedTimeScale(time as HistoricalDataIntervals);
    };

    return (
        <>
            <div
                data-testid='timescale-selector'
                className='flex items-center justify-between border-neutral-700 bg-gunMetal/60 px-4 py-2 laptop:border-b desktop:py-2.5'
            >
                <div className='flex w-[65px] laptop:w-[75px] desktop:hidden'>
                    <DropdownSelector
                        optionList={timeScales}
                        selected={{
                            value: selectedTimeScale as string,
                            label: selectedTimeScale as string,
                        }}
                        onChange={(time: string) => onTimeScaleChange(time)}
                        variant='fullWidth'
                    />
                </div>
                <div className='hidden desktop:flex'>
                    <RadioButton
                        options={timeScales}
                        value={selectedTimeScale}
                        onChange={(time: string) => onTimeScaleChange(time)}
                    />
                </div>
                <Link
                    href='https://www.tradingview.com/'
                    target='_blank'
                    className='leading-3.5 rounded-md border border-neutral-200 px-2.5 py-1 text-2.5 font-semibold text-neutral-50'
                >
                    Powered by TradingView
                </Link>
            </div>
            <HistoricalChart data={data} timeScale={selectedTimeScale} />
        </>
    );
};
