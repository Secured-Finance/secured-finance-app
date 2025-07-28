import { useEffect, useMemo, useState } from 'react';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useGraphClientHook } from 'src/hooks';
import { Transaction24HVolume } from 'src/types';
import { currencyMap, CurrencySymbol } from 'src/utils';

const TRANSACTIONS_LIMIT = 1000;
const POLL_INTERVAL_MS = 10000;

export const use24HVolume = (): { data: Record<string, number> } => {
    const [timestamp] = useState(() => Math.round(Date.now() / 1000));
    const [allTransactions, setAllTransactions] = useState<
        Transaction24HVolume[]
    >([]);
    const [transactionSkip, setTransactionSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [latestTimestamp, setLatestTimestamp] = useState(0);

    const [queryArgs, setQueryArgs] = useState(() => ({
        from: timestamp - 24 * 3600,
        to: timestamp,
        first: TRANSACTIONS_LIMIT,
        skip: 0,
    }));

    const { data: transactionData } = useGraphClientHook(
        queryArgs,
        queries.TransactionsHistory24HDocument
    );

    useEffect(() => {
        if (!transactionData?.transactions) return;

        const currentBatch = transactionData.transactions;

        if (hasMore) {
            setAllTransactions(prev => [...prev, ...currentBatch]);

            if (currentBatch.length === TRANSACTIONS_LIMIT) {
                setTransactionSkip(prev => prev + TRANSACTIONS_LIMIT);
                setQueryArgs(prev => ({
                    ...prev,
                    skip: transactionSkip + TRANSACTIONS_LIMIT,
                }));
            } else {
                setHasMore(false);

                const maxCreatedAt = Math.max(
                    ...currentBatch.map(tx => Number(tx.createdAt))
                );
                setLatestTimestamp(maxCreatedAt);
            }
        } else {
            // Incremental polling
            if (currentBatch.length === 0) return;

            const now = Math.floor(Date.now() / 1000);
            const combined = [...allTransactions, ...currentBatch];

            const cutoff = now - 24 * 3600;
            const pruned = combined.filter(
                tx => Number(tx.createdAt) >= cutoff
            );

            setAllTransactions(pruned);

            const maxCreatedAt = Math.max(
                ...currentBatch.map(tx => Number(tx.createdAt))
            );
            setLatestTimestamp(prev => Math.max(prev, maxCreatedAt));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionData]);

    useEffect(() => {
        if (hasMore) return;

        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            setQueryArgs({
                from: latestTimestamp + 1,
                to: now,
                first: TRANSACTIONS_LIMIT,
                skip: 0,
            });
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [hasMore, latestTimestamp]);

    const result = useMemo(() => {
        const final: Record<string, number> = {};

        for (const tx of allTransactions) {
            const symbol = fromBytes32(tx.currency) as CurrencySymbol;
            const key = `${symbol}-${tx.maturity}`;
            const amount = currencyMap[symbol].fromBaseUnit(tx.amount);
            final[key] = (final[key] || 0) + amount;
        }

        return final;
    }, [allTransactions]);

    return { data: result };
};
