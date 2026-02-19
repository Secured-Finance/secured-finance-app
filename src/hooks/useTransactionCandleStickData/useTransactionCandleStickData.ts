import { useMemo } from 'react';
import { Transaction } from 'src/components/organisms';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';

const WEEK = 604800;
const MONTH = 2592000;

const safeDivide = (value: string | number, divisor: number): number => {
    const num = Number(value);
    if (isNaN(num) || divisor === 0) return 0;
    return num / divisor;
};

export const getSnappedTimestamp = (
    timestamp: number,
    interval: number
): number => {
    const date = new Date(timestamp * 1000);
    if (interval === WEEK) {
        // 1W: Snap to Monday 00:00:00 UTC
        const day = date.getUTCDay();
        const diff = day === 0 ? 6 : day - 1;
        date.setUTCDate(date.getUTCDate() - diff);
        date.setUTCHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
    } else if (interval === MONTH) {
        // 1M: Snap to 1st of month 00:00:00 UTC
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
    } else {
        return Math.floor(timestamp / interval) * interval;
    }
};

export const getPreviousTimestamp = (
    timestamp: number,
    interval: number
): number => {
    if (interval === MONTH) {
        const date = new Date(timestamp * 1000);
        date.setUTCMonth(date.getUTCMonth() - 1);
        return Math.floor(date.getTime() / 1000);
    }
    return timestamp - interval;
};

export const useTransactionCandleStickData = (
    historicalTradeData: { data?: { transactionCandleSticks?: Transaction[] } },
    selectedTimeScale: HistoricalDataIntervals
) => {
    const interval = Number(selectedTimeScale);
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

        let processedTransactions = [...transactions];
        if (interval === WEEK || interval === MONTH) {
            const aggregated: Transaction[] = [];
            let currentBucket: Transaction | null = null;
            let currentSnapped = 0;

            for (const tx of transactions) {
                const snapped = getSnappedTimestamp(
                    Number(tx.timestamp),
                    interval
                );
                if (!currentBucket || snapped !== currentSnapped) {
                    if (currentBucket) aggregated.push(currentBucket);
                    currentBucket = { ...tx, timestamp: snapped.toString() };
                    currentSnapped = snapped;
                } else {
                    currentBucket.high = Math.max(
                        Number(currentBucket.high),
                        Number(tx.high)
                    ).toString();
                    currentBucket.low = Math.min(
                        Number(currentBucket.low),
                        Number(tx.low)
                    ).toString();
                    currentBucket.volume = (
                        BigInt(currentBucket.volume) + BigInt(tx.volume)
                    ).toString();
                    currentBucket.open = tx.open;
                }
            }
            if (currentBucket) aggregated.push(currentBucket);
            processedTransactions = aggregated;
        }

        const editableTransactions = [...processedTransactions];
        const now = Math.floor(Date.now() / 1000);
        const intervalTimestamp = getSnappedTimestamp(now, interval);

        if (
            processedTransactions.length > 0 &&
            intervalTimestamp > Number(processedTransactions[0].timestamp)
        ) {
            const latestTransaction = {
                ...processedTransactions[0],
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
                let newTimestamp = getPreviousTimestamp(
                    Number(previousItem.timestamp),
                    interval
                );
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

                    newTimestamp = getPreviousTimestamp(newTimestamp, interval);
                }
            }
            const open = safeDivide(item.open, 100);
            const high = safeDivide(item.high, 100);
            const low = safeDivide(item.low, 100);
            const close = safeDivide(item.close, 100);
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
    }, [historicalTradeData, interval]);
};
