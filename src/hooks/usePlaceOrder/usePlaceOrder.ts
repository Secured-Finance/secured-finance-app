import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { currencyMap, CurrencySymbol } from 'src/utils';

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
                currencyMap[ccy].toCurrency(),
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
