import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import useSF from '../useSecuredFinance';

interface SmartContractOrderbook {
    unitPrices: BigNumber[];
    amounts: BigNumber[];
    quantities: BigNumber[];
}
export type OrderBookEntry = {
    amount: BigNumber;
    value: LoanValue;
};

export type OrderBook = Array<OrderBookEntry>;

const MAX_ORDERBOOK_LENGTH = 40;

const sortOrders = (
    a: OrderBookEntry,
    b: OrderBookEntry,
    order: 'asc' | 'desc'
) => {
    if (
        a.value.price === 0 ||
        b.value.price === 0 ||
        a.amount.isZero() ||
        b.amount.isZero()
    )
        return 1;
    return order === 'asc'
        ? a.value.price - b.value.price
        : b.value.price - a.value.price;
};

const transformOrderbook = (
    input: SmartContractOrderbook,
    maturity: number,
    direction: 'asc' | 'desc'
): OrderBook => {
    const orderBook = input.unitPrices.map((unitPrice, index) => ({
        amount: input.amounts[index],
        value: LoanValue.fromPrice(unitPrice.toNumber(), maturity),
    }));
    return orderBook.sort((a, b) => sortOrders(a, b, direction));
};

const trimOrderbook = (orderBook: {
    borrowOrderbook: OrderBook | [];
    lendOrderbook: OrderBook | [];
}) => {
    const trim = (orderBook: OrderBook) =>
        orderBook.filter(o => !o.amount.isZero());

    const size =
        Math.max(
            trim(orderBook.borrowOrderbook).length,
            trim(orderBook.lendOrderbook).length
        ) || 1;

    return {
        borrowOrderbook: orderBook.borrowOrderbook.slice(0, size),
        lendOrderbook: orderBook.lendOrderbook.slice(0, size),
    };
};

const emptyOrderbook = {
    lendOrderbook: [],
    borrowOrderbook: [],
};

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    limit: number = MAX_ORDERBOOK_LENGTH
) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    const [orderbook, setOrderbook] = useState<{
        borrowOrderbook: OrderBook | [];
        lendOrderbook: OrderBook | [];
    }>(emptyOrderbook);

    const fetchOrderbook = useCallback(
        async (
            securedFinance: SecuredFinanceClient,
            ccy: CurrencySymbol,
            maturity: number,
            limit: number
        ) => {
            const currency = toCurrency(ccy);
            const borrowOrderbook = transformOrderbook(
                await securedFinance.getBorrowOrderBook(
                    currency,
                    maturity,
                    limit
                ),
                maturity,
                'asc'
            );

            const lendOrderbook = transformOrderbook(
                await securedFinance.getLendOrderBook(
                    currency,
                    maturity,
                    limit
                ),
                maturity,
                'desc'
            );

            setOrderbook(
                trimOrderbook({
                    lendOrderbook,
                    borrowOrderbook,
                })
            );
        },
        []
    );

    useEffect(
        () => {
            if (securedFinance && !maturity.isZero()) {
                fetchOrderbook(securedFinance, ccy, maturity.toNumber(), limit);
            }
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            fetchOrderbook,
            securedFinance,
            block,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            maturity.toNumber(),
            ccy,
            limit,
        ]
    );

    return orderbook;
};
