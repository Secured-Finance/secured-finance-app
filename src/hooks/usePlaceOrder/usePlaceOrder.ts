import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';

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
            side: Side,
            amount: BigNumber,
            unitPrice?: number
        ) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.placeLendingOrder(
                    toCurrency(ccy),
                    maturity.toNumber(),
                    side,
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
