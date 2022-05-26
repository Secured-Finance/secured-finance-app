import { FilecoinNumber } from '@glif/filecoin-number';
import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import { Currency } from 'src/utils';
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
        let amountToSend;
        if (ccy === Currency.ETH) {
            amountToSend = utils.parseUnits(amount.toString(), 'wei');
        } else if (ccy === Currency.FIL) {
            amountToSend = new FilecoinNumber(amount, 'attofil').toAttoFil();
        } else {
            throw new Error('Unsupported currency');
        }

        const tx = await securedFinance.placeLendingOrder(
            ccy,
            term,
            side,
            BigNumber.from(amountToSend),
            rate
        );
        return tx;
    }, [securedFinance, ccy, term, side, amount, rate]);

    return { onPlaceOrder: handlePlaceOrder };
};
