import { useMemo } from 'react';
import { Transaction } from 'src/components/organisms';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';

const safeDivide = (value: string | number, divisor: number): number => {
    const num = Number(value);
    if (isNaN(num) || divisor === 0) return NaN;
    return num / divisor;
};

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
                const previousClose = safeDivide(previousItem.close, 100);

                while (newTimestamp > Number(item.timestamp)) {
                    result.push({
                        time: newTimestamp.toString(),
                        open: previousClose,
                        high: previousClose,
                        low: previousClose,
                        close: previousClose,
                        vol: 0,
                    });

                    newTimestamp -= Number(selectedTimeScale);
                }
            }
            const open = safeDivide(item.open, 100);
            const high = safeDivide(item.high, 100);
            const low = safeDivide(item.low, 100);
            const close = safeDivide(item.close, 100);
            // Add the actual item
            result.push({
                time: item.timestamp,
                open,
                high,
                low,
                close,
                vol: volAdjusted,
            });

            previousItem = item;
        }

        return result.reverse(); // Reverse to have the oldest data first
    }, [historicalTradeData, selectedTimeScale]);
};
