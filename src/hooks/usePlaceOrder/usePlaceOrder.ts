import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { Currency } from 'src/utils';

export enum OrderSide {
    Lend = 0,
    Borrow = 1,
}

export const usePlaceOrder = () => {
    const securedFinance = useSF();

    const placeOrder = useCallback(
        async (
            ccy: Currency,
            term: string,
            side: OrderSide,
            amount: BigNumber,
            rate: number
        ) => {
            if (!securedFinance) return;

            const tx = await securedFinance.placeLendingOrder(
                ccy,
                term,
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
