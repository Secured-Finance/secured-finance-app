import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const DEFAULT_ORDERBOOK_DEPTH = 26;

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
    maturity: number
): OrderBook => {
    return input.unitPrices.map((unitPrice, index) => ({
        amount: input.amounts[index],
        value: LoanValue.fromPrice(unitPrice.toNumber(), maturity),
    }));
};

export const useOrderbook = (ccy: CurrencySymbol, maturity: number) => {
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
            queryKey: [QueryKeys.ORDER_BOOK, ccy, maturity, depth],
            queryFn: async () => {
                const currency = toCurrency(ccy);
                const [borrowOrderbook, lendOrderbook] = await Promise.all([
                    securedFinance?.getBorrowOrderBook(
                        currency,
                        maturity,
                        depth
                    ),
                    securedFinance?.getLendOrderBook(currency, maturity, depth),
                ]);

                return {
                    lendOrderbook: {
                        unitPrices: lendOrderbook?.unitPrices ?? [],
                        amounts: lendOrderbook?.amounts ?? [],
                        quantities: lendOrderbook?.quantities ?? [],
                    },
                    borrowOrderbook: {
                        unitPrices: borrowOrderbook?.unitPrices ?? [],
                        amounts: borrowOrderbook?.amounts ?? [],
                        quantities: borrowOrderbook?.quantities ?? [],
                    },
                };
            },
            select: data => {
                return {
                    borrowOrderbook: transformOrderbook(
                        data.borrowOrderbook,
                        maturity
                    ),
                    lendOrderbook: transformOrderbook(
                        data.lendOrderbook,
                        maturity
                    ),
                };
            },
            enabled: !!securedFinance,
        }),
        setMultiplier,
        setIsShowingAll,
    ] as const;
};
