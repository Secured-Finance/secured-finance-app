import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, toCurrency } from 'src/utils';
import useSF from '../useSecuredFinance';

export interface Orderbook {
    rates: BigNumber[];
    amounts: BigNumber[];
    quantities: BigNumber[];
}

export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    limit: number
) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [borrowOrderbook, setBorrowOrderbook] = useState<Orderbook | []>([]);
    const [lendOrderbook, setLendOrderbook] = useState<Orderbook | []>([]);

    const fetchOrderbook = useCallback(
        async (securedFinance: SecuredFinanceClient) => {
            const currency = toCurrency(ccy);
            setBorrowOrderbook(
                await securedFinance.getBorrowOrderBook(
                    currency,
                    maturity,
                    limit
                )
            );
            setLendOrderbook(
                await securedFinance.getLendOrderBook(currency, maturity, limit)
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
