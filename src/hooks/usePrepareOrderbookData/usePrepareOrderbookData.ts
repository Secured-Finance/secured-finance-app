import { useMemo } from 'react';
import { OrderBookEntry, sortOrders, useOrderbook } from 'src/hooks';
import { ZERO_BI } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export type AggregationFactorType = 1 | 10 | 100 | 1000;

export const usePrepareOrderbookData = <
    T extends keyof NonNullable<ReturnType<typeof useOrderbook>[0]['data']>
>(
    data: ReturnType<typeof useOrderbook>[0]['data'],
    orderbookType: T,
    limit: number,
    aggregationFactor: AggregationFactorType
) => {
    return useMemo(() => {
        if (!data) return [];

        const zeroValues = data[orderbookType].filter(
            order => order.amount === ZERO_BI
        );

        const result: Record<number, OrderBookEntry> = {};
        data[orderbookType]
            .filter(order => order.amount > 0)
            .forEach(order => {
                const price =
                    Math.trunc(Number(order.value.price) / aggregationFactor) *
                    aggregationFactor;
                if (!result[price]) {
                    result[price] = {
                        amount: order.amount,
                        value: LoanValue.fromPrice(
                            price,
                            order.value.maturity,
                            order.value.calculationDate
                        ),
                    };
                } else {
                    result[price].amount = result[price].amount + order.amount;
                }
            });

        const sortedResult = [...Object.values(result)].sort((a, b) =>
            sortOrders(a, b, 'desc')
        );

        return orderbookType === 'lendOrderbook'
            ? [...sortedResult, ...zeroValues].slice(0, limit)
            : [...zeroValues, ...sortedResult].slice(-limit);
    }, [data, orderbookType, aggregationFactor, limit]);
};
