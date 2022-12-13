import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';

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
            maturity: Maturity,
            side: OrderSide,
            amount: BigNumber,
            // eslint-disable-next-line @typescript-eslint/no-inferrable-types
            unitPrice: number = 0
        ) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.placeLendingOrder(
                    toCurrency(ccy),
                    maturity.toNumber(),
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
