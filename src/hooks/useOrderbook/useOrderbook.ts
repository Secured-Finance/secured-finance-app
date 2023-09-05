import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

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
const MIN_ORDERBOOK_LENGTH = 10;

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

const trimOrderbook = (
    orderBook: {
        borrowOrderbook: OrderBook | [];
        lendOrderbook: OrderBook | [];
    },
    minimumLength: number
) => {
    const trim = (orderBook: OrderBook) =>
        orderBook.filter(o => !o.amount.isZero());

    const size =
        Math.max(
            trim(orderBook.borrowOrderbook).length,
            trim(orderBook.lendOrderbook).length
        ) || 1;

    const maxLength = Math.max(size, minimumLength);

    if (maxLength > size) {
        const emptyOrderbook = Array(maxLength - size).fill({
            amount: BigNumber.from(0),
            value: LoanValue.fromPrice(0, 0),
        }) as never[];
        orderBook.borrowOrderbook.push(...emptyOrderbook);
        orderBook.lendOrderbook.push(...emptyOrderbook);
    }

    return {
        borrowOrderbook: orderBook.borrowOrderbook.slice(0, maxLength),
        lendOrderbook: orderBook.lendOrderbook.slice(0, maxLength),
    };
};

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    limit: number = MAX_ORDERBOOK_LENGTH,
    minimum: number = MIN_ORDERBOOK_LENGTH
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.ORDER_BOOK, ccy, maturity, limit],
        queryFn: async () => {
            const currency = toCurrency(ccy);
            const [borrowOrderbook, lendOrderbook] = await Promise.all([
                securedFinance?.getBorrowOrderBook(currency, maturity, limit),
                securedFinance?.getLendOrderBook(currency, maturity, limit),
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
            return trimOrderbook(
                {
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
                },
                minimum
            );
        },
        enabled: !!securedFinance,
    });
};
