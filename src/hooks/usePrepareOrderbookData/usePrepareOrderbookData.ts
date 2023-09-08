import { useMemo } from 'react';
import { OrderBookEntry, sortOrders, useOrderbook } from 'src/hooks';
import { LoanValue } from 'src/utils/entities';

export type AggregationFactorType = 1 | 10 | 100 | 1000;

export const usePrepareOrderbookData = <
    T extends keyof NonNullable<ReturnType<typeof useOrderbook>['data']>
>(
    data: ReturnType<typeof useOrderbook>['data'],
    orderbookType: T,
    aggregationFactor: AggregationFactorType
) => {
    return useMemo(() => {
        if (!data) return [];
        const result = data[orderbookType]
            .filter(order => order.amount.gt(0))
            .reduce((acc, order) => {
                const price =
                    Math.floor(Number(order.value.price) / aggregationFactor) *
                    aggregationFactor;
                if (!acc[price]) {
                    acc[price] = {} as OrderBookEntry;
                    acc[price].amount = order.amount;
                    acc[price].value = LoanValue.fromPrice(
                        price,
                        order.value.maturity
                    );
                } else {
                    acc[price].amount = acc[price].amount.add(order.amount);
                }
                return acc;
            }, {} as Record<number, OrderBookEntry>);

        return [...Object.values(result)].sort((a, b) =>
            sortOrders(a, b, 'desc')
        );
    }, [data, orderbookType, aggregationFactor]);
};
