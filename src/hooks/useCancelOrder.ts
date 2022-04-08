import { useCallback } from 'react';
import { useWallet } from 'use-wallet';

import { cancelOrder, getLendingMarketContract } from '../services/sdk/utils';
import useSF from './useSecuredFinance';

export const useCancelOrder = (ccy: number, term: number, orderId: any) => {
    const securedFinance = useSF();
    const { account } = useWallet();
    const lendingMarket = getLendingMarketContract(securedFinance, ccy, term);

    const handleCancelOrder = useCallback(async () => {
        try {
            const tx = await cancelOrder(lendingMarket, account, orderId);
            return tx;
        } catch (e) {
            return false;
        }
    }, [account, lendingMarket, orderId]);

    return { onCancelOrder: handleCancelOrder };
};
