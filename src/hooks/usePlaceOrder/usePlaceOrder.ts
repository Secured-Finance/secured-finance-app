import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export enum OrderSide {
    Lend = '0',
    Borrow = '1',
}

export enum OrderType {
    MARKET = 'Market',
    LIMIT = 'Limit',
    STOP = 'Stop',
}

export const usePlaceOrder = () => {
    const securedFinance = useSF();

    const placeOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: BigNumber | number,
            side: OrderSide,
            amount: BigNumber,
            unitPrice: number
        ) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.placeLendingOrder(
                    toCurrency(ccy),
                    maturity,
                    side.toString(),
                    amount,
                    unitPrice
                );

                return tx;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    return { placeOrder };
};
