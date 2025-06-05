import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
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

export type Transaction = {
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
        let previousItem: Transaction | null = null;
        const result: Array<{
            time: string;
            open: number;
            high: number;
            low: number;
            close: number;
            vol: number;
        }> = [];

        const transactions =
            historicalTradeData.data?.transactionCandleSticks || [];

        const editableTransactions = [...transactions];
        const timestamp = Math.floor(Date.now() / 1000);
        const intervalTimestamp =
            timestamp - (timestamp % Number(selectedTimeScale));
        if (
            transactions.length > 0 &&
            intervalTimestamp > transactions[0].timestamp
        ) {
            const latestTransaction = {
                ...transactions[0],
                // Use the latest transaction's data but update the timestamp to current time
                timestamp: intervalTimestamp,
                volume: 0,
            };
            editableTransactions.unshift(latestTransaction);
        }
        for (const item of editableTransactions) {
            const ccy = hexToCurrencySymbol(item.currency);
            const volAdjusted = amountFormatterFromBase[ccy as CurrencySymbol](
                BigInt(item.volume)
            );

            // Fill missing timestamps data
            if (previousItem) {
                let newTimestamp =
                    Number(previousItem.timestamp) - Number(selectedTimeScale);

                while (newTimestamp > Number(item.timestamp)) {
                    result.push({
                        time: newTimestamp.toString(),
                        open: Number(previousItem.open) / 100,
                        high: Number(previousItem.high) / 100,
                        low: Number(previousItem.low) / 100,
                        close: Number(previousItem.close) / 100,
                        vol: 0, // No volume for generated entries
                    });

                    newTimestamp -= Number(selectedTimeScale);
                }
            }

            // Add the actual item
            result.push({
                time: item.timestamp,
                open: Number(item.open) / 100,
                high: Number(item.high) / 100,
                low: Number(item.low) / 100,
                close: Number(item.close) / 100,
                vol: volAdjusted,
            });

            previousItem = item;
        }

        return result.reverse(); // Reverse to have the oldest data first
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            </div>
            <HistoricalChart data={data} timeScale={selectedTimeScale} />
        </>
    );
};
