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

const transformOrderbook = (
    input: SmartContractOrderbook,
    maturity: number
): OrderBook => {
    return input.unitPrices.map((unitPrice, index) => ({
        amount: input.amounts[index],
        value: LoanValue.fromPrice(unitPrice.toNumber(), maturity),
    }));
};

const emptyOrderbook = {
    lendOrderbook: [],
    borrowOrderbook: [],
};

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    limit: number
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
                maturity
            );

            const lendOrderbook = transformOrderbook(
                await securedFinance.getLendOrderBook(
                    currency,
                    maturity,
                    limit
                ),
                maturity
            );

            setOrderbook({
                lendOrderbook,
                borrowOrderbook,
            });
        },
        []
    );

    useEffect(() => {
        if (securedFinance) {
            fetchOrderbook(securedFinance, ccy, maturity.getMaturity(), limit);
        }
    }, [fetchOrderbook, securedFinance, block, maturity, ccy, limit]);

    return orderbook;
};
