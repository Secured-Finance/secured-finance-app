import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, Rate, toCurrency } from 'src/utils';
import useSF from '../useSecuredFinance';

interface SmartContractOrderbook {
    unitPrices: BigNumber[];
    amounts: BigNumber[];
    quantities: BigNumber[];
}
export type OrderBookEntry = {
    amount: BigNumber;
    apy: Rate;
    price: number;
};

export type OrderBook = Array<OrderBookEntry>;

const transformOrderbook = (
    input: SmartContractOrderbook,
    maturity: number
): OrderBook => {
    return input.unitPrices.map((unitPrice, index) => ({
        amount: input.amounts[index],
        apy: Rate.fromPrice(unitPrice, BigNumber.from(maturity)),
        price: unitPrice.toNumber(),
    }));
};

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    limit: number
) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [borrowOrderbook, setBorrowOrderbook] = useState<OrderBook | []>([]);
    const [lendOrderbook, setLendOrderbook] = useState<OrderBook | []>([]);

    const fetchOrderbook = useCallback(
        async (securedFinance: SecuredFinanceClient) => {
            const currency = toCurrency(ccy);
            setBorrowOrderbook(
                transformOrderbook(
                    await securedFinance.getBorrowOrderBook(
                        currency,
                        maturity,
                        limit
                    ),
                    maturity
                )
            );
            setLendOrderbook(
                transformOrderbook(
                    await securedFinance.getLendOrderBook(
                        currency,
                        maturity,
                        limit
                    ),
                    maturity
                )
            );
        },
        [ccy, limit, maturity]
    );

    useEffect(() => {
        if (securedFinance) {
            fetchOrderbook(securedFinance);
        }
    }, [fetchOrderbook, securedFinance, block]);

    return { borrowOrderbook, lendOrderbook };
};
