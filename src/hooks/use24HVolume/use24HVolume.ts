import { useEffect, useState } from 'react';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { useGraphClientHook } from 'src/hooks';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { Transaction24HVolume } from 'src/types';

const TRANSACTIONS_LIMIT = 1000;

export const use24HVolume = (): { data: Record<string, number> } => {
    const [timestamp] = useState(() => Math.round(Date.now() / 1000));
    const [allTransactions, setAllTransactions] = useState<
        Transaction24HVolume[]
    >([]);
    const [transactionSkip, setTransactionSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { data: transactionData } = useGraphClientHook(
        {
            from: timestamp - 24 * 3600,
            to: timestamp,
            first: TRANSACTIONS_LIMIT,
            skip: transactionSkip,
        },
        queries.TransactionsHistory24HDocument
    );

    useEffect(() => {
        if (!transactionData?.transactions) return;

        const currentBatch = transactionData.transactions;
        setAllTransactions(prev => [...prev, ...currentBatch]);

        if (currentBatch.length === TRANSACTIONS_LIMIT) {
            setTransactionSkip(prev => prev + TRANSACTIONS_LIMIT);
        } else {
            setHasMore(false);
        }
    }, [transactionData]);

    const result: Record<string, number> = {};
    const grouped: Record<string, bigint> = {};

    if (!hasMore && allTransactions.length > 0) {
        for (const tx of allTransactions) {
            const symbol = fromBytes32(tx.currency) as CurrencySymbol;
            const key = `${symbol}-${tx.maturity}`;
            const amount = BigInt(tx.amount);
            grouped[key] = (grouped[key] || BigInt(0)) + amount;
        }

        for (const key in grouped) {
            const [currencySymbol] = key.split('-');
            const symbol = currencySymbol as CurrencySymbol;
            result[key] = currencyMap[symbol].fromBaseUnit(grouped[key]) || 0;
        }
    }

    return { data: result };
};
