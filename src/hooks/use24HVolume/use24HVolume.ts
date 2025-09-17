import { useEffect, useState } from 'react';
import { useTransactionsHistory24HQuery } from 'src/generated/subgraph';
import { Transaction24HVolume } from 'src/types';
import { AmountConverter, CurrencyConverter } from 'src/utils';
import { getGraphQLConfig } from 'src/utils/graphql';

const TRANSACTIONS_LIMIT = 1000;

export const use24HVolume = (): { data: Record<string, number> } => {
    const [timestamp] = useState(() => Math.round(Date.now() / 1000));
    const [allTransactions, setAllTransactions] = useState<
        Transaction24HVolume[]
    >([]);
    const [transactionSkip, setTransactionSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { data: transactionData } = useTransactionsHistory24HQuery(
        getGraphQLConfig(),
        {
            from: String(timestamp - 24 * 3600),
            to: String(timestamp),
            first: TRANSACTIONS_LIMIT,
            skip: transactionSkip,
        }
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

    if (!hasMore && allTransactions.length > 0) {
        for (const tx of allTransactions) {
            const symbol = CurrencyConverter.bytes32ToSymbol(tx.currency);
            if (!symbol) continue;
            const key = `${symbol}-${tx.maturity}`;
            result[key] =
                (result[key] || 0) +
                AmountConverter.fromBase(tx.amount, symbol);
        }
    }

    return { data: result };
};
