import { useMemo } from 'react';
import { Transaction } from 'src/components/organisms';
import { HistoricalDataIntervals } from 'src/types';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    AmountConverter,
    CurrencySymbol,
    hexToCurrencySymbol,
    TimestampConverter,
} from 'src/utils';

const safeDivide = (value: string | number, divisor: number): number => {
    const num = Number(value);
    if (isNaN(num) || divisor === 0) return 0;
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
        const timestamp = TimestampConverter.getCurrentTimestamp();
        const intervalTimestamp = TimestampConverter.calculateIntervalTimestamp(
            timestamp,
            selectedTimeScale
        );

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
            const volAdjusted = AmountConverter.fromBase(
                BigInt(item.volume),
                ccy as CurrencySymbol
            );

            // Fill missing timestamps data
            if (previousItem) {
                let newTimestamp =
                    Number(previousItem.timestamp) - Number(selectedTimeScale);
                const previousClose = safeDivide(
                    previousItem.close,
                    FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
                );

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
            const open = safeDivide(
                item.open,
                FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
            );
            const high = safeDivide(
                item.high,
                FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
            );
            const low = safeDivide(
                item.low,
                FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
            );
            const close = safeDivide(
                item.close,
                FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR
            );
            // Add the actual item
            if (volAdjusted > 0) {
                result.push({
                    time: item.timestamp,
                    open,
                    high,
                    low,
                    close,
                    vol: volAdjusted,
                });
            }

            previousItem = item;
        }

        return result.reverse(); // Reverse to have the oldest data first
    }, [historicalTradeData, selectedTimeScale]);
};
