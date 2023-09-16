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

        const zeroValues = data[orderbookType].filter(order =>
            order.amount.isZero()
        );

        const result: Record<number, OrderBookEntry> = {};
        data[orderbookType]
            .filter(order => order.amount.gt(0))
            .forEach(order => {
                const price =
                    Math.trunc(Number(order.value.price) / aggregationFactor) *
                    aggregationFactor;
                if (!result[price]) {
                    result[price] = {
                        amount: order.amount,
                        value: LoanValue.fromPrice(price, order.value.maturity),
                    };
                } else {
                    result[price].amount = result[price].amount.add(
                        order.amount
                    );
                }
            });

        const sortedResult = [...Object.values(result)].sort((a, b) =>
            sortOrders(a, b, 'desc')
        );

        return orderbookType === 'lendOrderbook'
            ? [...sortedResult, ...zeroValues]
            : [...zeroValues, ...sortedResult];
    }, [data, orderbookType, aggregationFactor]);
};
