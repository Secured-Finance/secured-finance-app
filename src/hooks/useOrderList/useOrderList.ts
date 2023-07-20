import { Currency } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import { hexToCurrencySymbol, toCurrency } from 'src/utils';

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

const emptyOrderList = {
    activeOrderList: [],
    inactiveOrderList: [],
};

const sortOrders = (a: Order, b: Order) => {
    return Number(b.createdAt.sub(a.createdAt));
};

export const useOrderList = (account: string | null) => {
    const securedFinance = useSF();

    const { latestBlock, lastActionTimestamp } = useSelector(
        (state: RootState) => state.blockchain
    );

    const [orderList, setOrderList] = useState<{
        activeOrderList: OrderList | [];
        inactiveOrderList: OrderList | [];
    }>(emptyOrderList);

    const fetchOrdersList = useCallback(async () => {
        if (!securedFinance || !account) {
            setOrderList(emptyOrderList);
            return;
        }

        const usedCurrenciesListInHex =
            await securedFinance.getUsedCurrenciesForOrders(account);
        const convertedCurrencies = usedCurrenciesListInHex
            .map(currency => {
                const symbol = hexToCurrencySymbol(currency);
                const convertedCurrency = symbol ? toCurrency(symbol) : null;
                return convertedCurrency;
            })
            .filter((currency): currency is Currency => currency !== null);

        const { activeOrders, inactiveOrders } =
            await securedFinance.getOrderList(account, convertedCurrencies);

        const activeOrderList = activeOrders
            .map(order => ({
                orderId: BigNumber.from(order.orderId),
                currency: order.ccy,
                maturity: order.maturity.toString(),
                side: order.side,
                unitPrice: order.unitPrice,
                amount: order.amount,
                createdAt: order.timestamp,
            }))
            .sort((a, b) => sortOrders(a, b));

        const inactiveOrderList = inactiveOrders
            .map(order => ({
                orderId: BigNumber.from(order.orderId),
                currency: order.ccy,
                maturity: order.maturity.toString(),
                side: order.side,
                unitPrice: order.unitPrice,
                amount: order.amount,
                createdAt: order.timestamp,
            }))
            .sort((a, b) => sortOrders(a, b));

        setOrderList({
            activeOrderList,
            inactiveOrderList,
        });
    }, [account, securedFinance]);

    useEffect(() => {
        fetchOrdersList();
    }, [latestBlock, fetchOrdersList, lastActionTimestamp]);

    return orderList;
};
