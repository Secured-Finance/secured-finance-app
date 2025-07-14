import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { useGraphClientHook } from '../useGraphClientHook';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useEffect, useState } from 'react';

export const use24HVolume = (): { data: Record<string, number> } => {
    const grouped: Record<string, bigint> = {};
    const [timestamp, setTimestamp] = useState(
        Math.round(new Date().getTime() / 1000)
    );

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const { data: transactionData } = useGraphClientHook(
        {
            from: timestamp - 24 * 3600,
            to: timestamp,
            first: 1000,
            skip: 0,
        },
        queries.TransactionsHistory24HDocument
    );

    const result: Record<string, number> = {};

    if (!transactionData?.transactions) return { data: result };

    for (const tx of transactionData.transactions) {
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

    return { data: result };
};
