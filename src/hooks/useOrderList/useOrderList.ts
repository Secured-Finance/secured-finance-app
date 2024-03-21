import { OrderSide } from '@secured-finance/sf-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';
import { useLastPrices } from '../useLastPrices';

export type Order = {
    orderId: bigint;
    currency: string;
    maturity: string;
    side: number;
    unitPrice: bigint;
    amount: bigint;
    createdAt: bigint;
    user?: string;
};

export type OrderList = Array<Order>;

export const emptyOrdersPerCurrency = {
    [CurrencySymbol.ETH]: 0,
    [CurrencySymbol.WETHe]: 0,
    [CurrencySymbol.WFIL]: 0,
    [CurrencySymbol.USDC]: 0,
    [CurrencySymbol.WBTC]: 0,
    [CurrencySymbol.BTCb]: 0,
    [CurrencySymbol.aUSDC]: 0,
    [CurrencySymbol.axlFIL]: 0,
};

export const emptyOrderList = {
    activeOrderList: [],
    inactiveOrderList: [],
    totalPVOfOpenOrdersInUSD: 0,
    ordersPerCurrency: emptyOrdersPerCurrency,
};

const sortOrders = (a: Order, b: Order) => {
    return Number(b.createdAt - a.createdAt);
};

export const useOrderList = (
    account: string | undefined,
    usedCurrencies: CurrencySymbol[]
) => {
    const securedFinance = useSF();

    const { data: assetPriceMap } = useLastPrices();

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
            const { activeOrders, inactiveOrders } = orderList;

            const {
                activeOrderList,
                totalPVOfOpenOrdersInUSD,
                ordersPerCurrency,
            } = activeOrders.reduce(
                (result, order) => {
                    const {
                        orderId,
                        ccy,
                        maturity,
                        side,
                        unitPrice,
                        amount,
                        timestamp,
                        isPreOrder,
                    } = order;

                    result.activeOrderList.push({
                        orderId: BigInt(orderId),
                        currency: ccy,
                        maturity: maturity.toString(),
                        side,
                        unitPrice: unitPrice,
                        amount: amount,
                        createdAt: timestamp,
                        isPreOrder,
                    });

                    const currency = hexToCurrencySymbol(ccy);

                    if (currency && side === OrderSide.LEND) {
                        result.totalPVOfOpenOrdersInUSD +=
                            assetPriceMap[currency] *
                            amountFormatterFromBase[currency](amount);
                    }

                    const ccySymbol = hexToCurrencySymbol(ccy);

                    if (ccySymbol) {
                        result.ordersPerCurrency[ccySymbol] += 1;
                    }

                    return result;
                },
                {
                    activeOrderList: [] as {
                        orderId: bigint;
                        currency: string;
                        maturity: string;
                        side: number;
                        unitPrice: bigint;
                        amount: bigint;
                        createdAt: bigint;
                        isPreOrder: boolean;
                    }[],
                    totalPVOfOpenOrdersInUSD: 0,
                    ordersPerCurrency: { ...emptyOrdersPerCurrency },
                }
            );

            const sortedActiveOrderList = activeOrderList.sort((a, b) =>
                sortOrders(a, b)
            );

            const inactiveOrderList = inactiveOrders
                .map(order => ({
                    orderId: BigInt(order.orderId),
                    currency: order.ccy,
                    maturity: order.maturity.toString(),
                    side: order.side,
                    unitPrice: order.unitPrice,
                    amount: order.amount,
                    createdAt: order.timestamp,
                    isPreOrder: order.isPreOrder,
                }))
                .sort((a, b) => sortOrders(a, b));

            return {
                activeOrderList: sortedActiveOrderList,
                inactiveOrderList,
                totalPVOfOpenOrdersInUSD,
                ordersPerCurrency,
            };
        },
        enabled: !!securedFinance && !!account && !!usedCurrencyKey,
    });
};
