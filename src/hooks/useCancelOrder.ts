import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import useSF from './useSecuredFinance';

export const useCancelOrder = (
    ccy: CurrencySymbol,
    maturity: number | BigNumber,
    orderId: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleCancelOrder = useCallback(async () => {
        if (!securedFinance) return;
        const tx = await securedFinance.cancelLendingOrder(
            toCurrency(ccy),
            maturity,
            orderId
        );
        return tx;
    }, [securedFinance, ccy, maturity, orderId]);

    return { onCancelOrder: handleCancelOrder };
};
