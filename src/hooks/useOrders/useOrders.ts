import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import useSF from '../useSecuredFinance';

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

    return { handleCancelOrder };
};
