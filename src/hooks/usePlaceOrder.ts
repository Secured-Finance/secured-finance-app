import { utils } from 'ethers';
import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const usePlaceOrder = (
    ccy: string,
    term: string,
    side: number,
    amount: number,
    rate: number
) => {
    const securedFinance = useSF();

    const handlePlaceOrder = useCallback(async () => {
        const etherAmount = utils.parseUnits(amount.toString(), 'wei');
        console.log(etherAmount.toString());
        const tx = await securedFinance.placeLendingOrder(
            ccy,
            term,
            side,
            etherAmount,
            rate
        );
        return tx;
    }, [securedFinance, ccy, term, side, amount, rate]);

    return { onPlaceOrder: handlePlaceOrder };
};
