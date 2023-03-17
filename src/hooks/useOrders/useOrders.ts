import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import useSF from '../useSecuredFinance';

export enum OrderType {
    MARKET = 'Market',
    LIMIT = 'Limit',
}

export const useOrders = () => {
    const securedFinance = useSF();

    const handleCancelOrder = useCallback(
        async (
            orderId: number | BigNumber,
            ccy: CurrencySymbol,
            maturity: Maturity
        ) => {
            if (!securedFinance) return;
            const tx = await securedFinance.cancelLendingOrder(
                toCurrency(ccy),
                maturity.toNumber(),
                orderId
            );
            return tx;
        },
        [securedFinance]
    );

    const placeOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: Maturity,
            side: OrderSide,
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

    return { handleCancelOrder, placeOrder };
};
