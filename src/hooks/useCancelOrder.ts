import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import useSF from './useSecuredFinance';

export const useCancelOrder = (
    ccy: string,
    term: string,
    orderId: number | BigNumber
) => {
    const securedFinance = useSF();
    const { account }: { account: string; ethereum: provider } = useWallet();

    const handleCancelOrder = useCallback(async () => {
        const tx = await securedFinance.cancelLendingOrder(ccy, term, orderId);
        return tx;
    }, [account, securedFinance, ccy, term, orderId]);

    return { onCancelOrder: handleCancelOrder };
};
