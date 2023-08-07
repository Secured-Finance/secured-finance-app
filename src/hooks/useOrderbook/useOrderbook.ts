import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
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

export const sortOrders = (
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

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    limit: number = MAX_ORDERBOOK_LENGTH
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: ['getOrderbook', ccy, maturity, limit],
        queryFn: async () => {
            const currency = toCurrency(ccy);
            const borrowOrderbook = await securedFinance?.getBorrowOrderBook(
                currency,
                maturity,
                limit
            );

            const lendOrderbook = await securedFinance?.getLendOrderBook(
                currency,
                maturity,
                limit
            );

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
        initialData: {
            borrowOrderbook: {
                unitPrices: [],
                amounts: [],
                quantities: [],
            },
            lendOrderbook: {
                unitPrices: [],
                amounts: [],
                quantities: [],
            },
        },
        select: data => {
            return trimOrderbook({
                borrowOrderbook: transformOrderbook(
                    data.borrowOrderbook,
                    maturity,
                    'asc'
                ),
                lendOrderbook: transformOrderbook(
                    data.lendOrderbook,
                    maturity,
                    'desc'
                ),
            });
        },
        enabled: !!securedFinance,
    });
};
