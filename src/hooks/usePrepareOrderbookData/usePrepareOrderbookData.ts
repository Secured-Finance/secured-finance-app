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
                const priceFactor =
                    Number(order.value.price) / aggregationFactor;
                const price =
                    orderbookType === 'borrowOrderbook'
                        ? Math.ceil(priceFactor) * aggregationFactor
                        : Math.floor(priceFactor) * aggregationFactor;
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
                    result[price].amount += order.amount;
                }
            });

        const sortedResult = [...Object.values(result)].sort((a, b) =>
            sortOrders(a, b, 'desc')
        );

        if (orderbookType === 'lendOrderbook') {
            for (let i = 1; i < sortedResult.length; i++) {
                sortedResult[i].amount += sortedResult[i - 1].amount;
            }
        } else if (orderbookType === 'borrowOrderbook') {
            for (let j = sortedResult.length - 1; j > 0; j--) {
                sortedResult[j - 1].amount += sortedResult[j].amount;
            }
        }

        return orderbookType === 'lendOrderbook'
            ? [...sortedResult, ...zeroValues].slice(0, limit)
            : [...zeroValues, ...sortedResult].slice(-limit);
    }, [data, orderbookType, aggregationFactor, limit]);
};
