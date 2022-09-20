import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export enum OrderSide {
    Lend = 'Lend',
    Borrow = 'Borrow',
}

export const usePlaceOrder = () => {
    const securedFinance = useSF();

    const placeOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: number | BigNumber,
            side: OrderSide,
            amount: BigNumber,
            rate: number
        ) => {
            if (!securedFinance) return;

            const tx = await securedFinance.placeLendingOrder(
                toCurrency(ccy),
                maturity,
                side,
                amount,
                rate
            );
            return tx;
        },
        [securedFinance]
    );

    return { placeOrder };
};
