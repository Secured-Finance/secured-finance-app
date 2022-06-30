import { FilecoinNumber } from '@glif/filecoin-number';
import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import { Currency } from 'src/utils';
import useSF from '../useSecuredFinance';

export const usePlaceOrder = () => {
    const securedFinance = useSF();

    const placeOrder = useCallback(
        async (
            ccy: string,
            term: string,
            side: number,
            amount: number,
            rate: number
        ) => {
            if (!securedFinance) return;
            let amountToSend;
            if (ccy === Currency.ETH) {
                amountToSend = utils.parseUnits(amount.toString(), 'wei');
            } else if (ccy === Currency.FIL) {
                amountToSend = new FilecoinNumber(
                    amount,
                    'attofil'
                ).toAttoFil();
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
        },
        [securedFinance]
    );

    return { placeOrder };
};
