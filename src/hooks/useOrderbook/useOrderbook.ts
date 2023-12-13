import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI, toCurrency } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const DEFAULT_ORDERBOOK_DEPTH = 26;

interface SmartContractOrderbook {
    unitPrices: bigint[];
    amounts: bigint[];
    quantities: bigint[];
    next: bigint;
}
export type OrderBookEntry = {
    amount: bigint;
    value: LoanValue;
};

export type OrderBook = Array<OrderBookEntry>;

export const sortOrders = (
    a: OrderBookEntry,
    b: OrderBookEntry,
    order: 'asc' | 'desc'
) => {
    return order === 'asc'
        ? a.value.price - b.value.price
        : b.value.price - a.value.price;
};

const transformOrderbook = (
    input: SmartContractOrderbook,
    maturity: number,
    calculationDate: number | undefined
): OrderBook => {
    return input.unitPrices.map((unitPrice, index) => ({
        amount: input.amounts[index],
        value: LoanValue.fromPrice(
            Number(unitPrice),
            maturity,
            calculationDate
        ),
    }));
};

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    calculationDate?: number,
    borrowStartPrice = 0,
    lendStartPrice = 0
) => {
    const securedFinance = useSF();
    const [depth, setDepth] = useState(DEFAULT_ORDERBOOK_DEPTH);
    const [multiplier, setMultiplier] = useState(1);
    const [isShowingAll, setIsShowingAll] = useState(true);

    useEffect(() => {
        setDepth(
            (DEFAULT_ORDERBOOK_DEPTH * multiplier) / (isShowingAll ? 2 : 1)
        );
    }, [isShowingAll, multiplier]);

    return [
        useQuery({
            queryKey: [
                QueryKeys.ORDER_BOOK,
                ccy,
                maturity,
                depth,
                borrowStartPrice,
                lendStartPrice,
            ],
            queryFn: async () => {
                const currency = toCurrency(ccy);
                const [borrowOrderbook, lendOrderbook] = await Promise.all([
                    securedFinance?.getBorrowOrderBook(
                        currency,
                        maturity,
                        borrowStartPrice,
                        depth
                    ),
                    securedFinance?.getLendOrderBook(
                        currency,
                        maturity,
                        lendStartPrice,
                        depth
                    ),
                ]);

                return {
                    lendOrderbook: {
                        unitPrices: lendOrderbook?.unitPrices ?? [],
                        amounts: lendOrderbook?.amounts ?? [],
                        quantities: lendOrderbook?.quantities ?? [],
                        next: lendOrderbook?.next ?? ZERO_BI,
                    },
                    borrowOrderbook: {
                        unitPrices: borrowOrderbook?.unitPrices ?? [],
                        amounts: borrowOrderbook?.amounts ?? [],
                        quantities: borrowOrderbook?.quantities ?? [],
                        next: borrowOrderbook?.next ?? ZERO_BI,
                    },
                };
            },
            select: data => {
                return {
                    borrowOrderbook: transformOrderbook(
                        data.borrowOrderbook as SmartContractOrderbook,
                        maturity,
                        calculationDate
                    ),
                    lendOrderbook: transformOrderbook(
                        data.lendOrderbook as SmartContractOrderbook,
                        maturity,
                        calculationDate
                    ),
                };
            },
            enabled: !!securedFinance,
        }),
        setMultiplier,
        setIsShowingAll,
    ] as const;
};

export const useBorrowOrderBook = (
    ccy: CurrencySymbol,
    maturity: number,
    lastBorrowPrice: number
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.BORROW_ORDER_BOOK, ccy, maturity, lastBorrowPrice],
        queryFn: async () => {
            let res = ZERO_BI;
            let lastUnitPrice = ZERO_BI;
            const currency = toCurrency(ccy);
            let borrowOrderBook: SmartContractOrderbook = {
                unitPrices: [],
                amounts: [],
                quantities: [],
                next: ZERO_BI,
            };
            do {
                const orderBook = (await securedFinance?.getBorrowOrderBook(
                    currency,
                    maturity,
                    Number(borrowOrderBook.next),
                    1000
                )) as SmartContractOrderbook;
                borrowOrderBook = {
                    unitPrices: borrowOrderBook.unitPrices.concat(
                        orderBook.unitPrices
                    ),
                    amounts: borrowOrderBook.amounts.concat(orderBook.amounts),
                    quantities: borrowOrderBook.quantities.concat(
                        orderBook.quantities
                    ),
                    next: orderBook.next,
                };
                lastUnitPrice =
                    orderBook.unitPrices[orderBook.unitPrices.length - 1];
            } while (
                borrowOrderBook.next !== ZERO_BI &&
                lastBorrowPrice >= lastUnitPrice
            );

            borrowOrderBook.unitPrices.forEach((unitPrice, index) => {
                if (unitPrice <= lastBorrowPrice) {
                    res += borrowOrderBook.amounts[index];
                }
            });
            return res;
        },
        enabled: !!securedFinance && !!ccy && !!maturity && !!lastBorrowPrice,
    });
};

export const useLendOrderBook = (
    ccy: CurrencySymbol,
    maturity: number,
    lastLendPrice: number
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.LEND_ORDER_BOOK, ccy, maturity, lastLendPrice],
        queryFn: async () => {
            let res = ZERO_BI;
            let lastUnitPrice = ZERO_BI;
            const currency = toCurrency(ccy);
            let lendOrderBook: SmartContractOrderbook = {
                unitPrices: [],
                amounts: [],
                quantities: [],
                next: ZERO_BI,
            };
            do {
                const orderBook = (await securedFinance?.getLendOrderBook(
                    currency,
                    maturity,
                    Number(lendOrderBook.next),
                    1000
                )) as SmartContractOrderbook;
                lendOrderBook = {
                    unitPrices: lendOrderBook.unitPrices.concat(
                        orderBook.unitPrices
                    ),
                    amounts: lendOrderBook.amounts.concat(orderBook.amounts),
                    quantities: lendOrderBook.quantities.concat(
                        orderBook.quantities
                    ),
                    next: orderBook.next,
                };
                lastUnitPrice =
                    orderBook.unitPrices[orderBook.unitPrices.length - 1];
            } while (
                lendOrderBook.next !== ZERO_BI &&
                lastUnitPrice >= lastLendPrice
            );

            lendOrderBook.unitPrices.forEach((unitPrice, index) => {
                if (unitPrice >= lastLendPrice) {
                    res += lendOrderBook.amounts[index];
                }
            });
            return res;
        },
        enabled: !!securedFinance && !!ccy && !!maturity && !!lastLendPrice,
    });
};
