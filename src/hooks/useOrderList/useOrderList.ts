import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export type Order = {
    orderId: BigNumber;
    currency: string;
    maturity: string;
    side: number;
    unitPrice: BigNumber;
    amount: BigNumber;
    createdAt: BigNumber;
};

export type OrderList = Array<Order>;

export const emptyOrderList = {
    activeOrderList: [],
    inactiveOrderList: [],
};

const sortOrders = (a: Order, b: Order) => {
    return Number(b.createdAt.sub(a.createdAt));
};

export const useOrderList = (
    account: string | undefined,
    usedCurrencies: CurrencySymbol[]
) => {
    const securedFinance = useSF();

    const usedCurrencyKey = useMemo(() => {
        return usedCurrencies.sort().join('-');
    }, [usedCurrencies]);

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [QueryKeys.ORDER_LIST, account, usedCurrencyKey],
        queryFn: async () => {
            const orders = await securedFinance?.getOrderList(
                account ?? '',
                usedCurrencies.map(c => toCurrency(c))
            );
            return (
                orders ?? {
                    activeOrders: [],
                    inactiveOrders: [],
                }
            );
        },
        select: orderList => {
            return {
                activeOrderList: orderList.activeOrders
                    .map(order => ({
                        orderId: BigNumber.from(order.orderId),
                        currency: order.ccy,
                        maturity: order.maturity.toString(),
                        side: order.side,
                        unitPrice: order.unitPrice,
                        amount: order.amount,
                        createdAt: order.timestamp,
                        isPreOrder: order.isPreOrder,
                    }))
                    .sort((a, b) => sortOrders(a, b)),
                inactiveOrderList: orderList.inactiveOrders
                    .map(order => ({
                        orderId: BigNumber.from(order.orderId),
                        currency: order.ccy,
                        maturity: order.maturity.toString(),
                        side: order.side,
                        unitPrice: order.unitPrice,
                        amount: order.amount,
                        createdAt: order.timestamp,
                        isPreOrder: order.isPreOrder,
                    }))
                    .sort((a, b) => sortOrders(a, b)),
            };
        },
        enabled: !!securedFinance && !!account && !!usedCurrencyKey,
    });
};
