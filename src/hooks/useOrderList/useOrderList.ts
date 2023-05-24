import { BigNumber } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import useSF from '../useSecuredFinance';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { Currency } from '@secured-finance/sf-core';
import { toCurrency, hexToCurrencySymbol } from 'src/utils';

export type Order = {
    orderId: BigNumber;
    currency: string;
    maturity: string;
    side: number;
    unitPrice: BigNumber;
    amount: BigNumber;
    timestamp: BigNumber;
};

export type OrderList = Array<Order>;

const emptyOrderList = {
    activeOrderList: [],
    inactiveOrderList: [],
};

export const useOrderList = (account: string | null) => {
    const securedFinance = useSF();

    const [orderList, setOrderList] = useState<{
        activeOrderList: OrderList | [];
        inactiveOrderList: OrderList | [];
    }>(emptyOrderList);

    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    const fetchOrdersList = useCallback(async () => {
        if (!securedFinance || !account) {
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

        const activeOrderList = activeOrders.map(order => ({
            orderId: BigNumber.from(order.orderId),
            currency: order.ccy,
            maturity: order.maturity.toString(),
            side: order.side,
            unitPrice: order.unitPrice,
            amount: order.amount,
            timestamp: order.timestamp,
        }));

        const inactiveOrderList = inactiveOrders.map(order => ({
            orderId: BigNumber.from(order.orderId),
            currency: order.ccy,
            maturity: order.maturity.toString(),
            side: order.side,
            unitPrice: order.unitPrice,
            amount: order.amount,
            timestamp: order.timestamp,
        }));

        setOrderList({
            activeOrderList,
            inactiveOrderList,
        });
    }, [account, securedFinance]);

    useEffect(() => {
        fetchOrdersList();
        return () => {
            setOrderList(emptyOrderList);
        };
    }, [fetchOrdersList, block]);

    return orderList;
};
