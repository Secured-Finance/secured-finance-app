import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useCancelOrder = (
    ccy: string,
    term: string,
    orderId: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleCancelOrder = useCallback(async () => {
        if (!securedFinance) return;
        const tx = await securedFinance.cancelLendingOrder(ccy, term, orderId);
        return tx;
    }, [securedFinance, ccy, term, orderId]);

    return { onCancelOrder: handleCancelOrder };
};
