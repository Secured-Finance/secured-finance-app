import { useMemo } from 'react';
import { Transaction } from 'src/components/organisms';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';

export const useTransactionCandleStickData = (
    historicalTradeData: { data?: { transactionCandleSticks?: Transaction[] } },
    selectedTimeScale: HistoricalDataIntervals
) => {
    return useMemo(() => {
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
            intervalTimestamp > Number(transactions[0].timestamp)
        ) {
            const latestTransaction = {
                ...transactions[0],
                timestamp: intervalTimestamp.toString(),
                volume: '0',
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
    }, [historicalTradeData, selectedTimeScale]);
};
