import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import { getLendingMarketContract, placeOrder } from '../services/sdk/utils';
import useSF from './useSecuredFinance';

export const usePlaceOrder = (
    ccy: number,
    term: number,
    side: number,
    amount: number,
    rate: number
) => {
    const securedFinance = useSF();
    const { account } = useWallet();
    const lendingMarket = getLendingMarketContract(securedFinance, ccy, term);
    const deadline = Date.now() + 60 * 60 * 24 * 14;

    const handlePlaceOrder = useCallback(async () => {
        try {
            const amountBN = new BigNumber(amount).multipliedBy(
                new BigNumber(10).pow(18)
            );
            const tx = await placeOrder(
                lendingMarket,
                account,
                side,
                amount,
                rate,
                deadline
            );
            return tx;
        } catch (e) {
            return false;
        }
    }, [lendingMarket, ccy, term, side, amount, rate]);

    return { onPlaceOrder: handlePlaceOrder };
};
