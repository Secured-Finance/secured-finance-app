import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';

import {
    approve,
    getLendingMarketContract,
    getUsdcContract,
} from '../services/sdk/utils';
import useSF from './useSecuredFinance';

const useApprove = (ccy: number, term: number) => {
    const securedFinance = useSF();
    const { account }: { account: string; ethereum: provider } = useWallet();
    const usdcContract = getUsdcContract(securedFinance);
    const lendingMarketContract = getLendingMarketContract(
        securedFinance,
        0,
        0
    );
    const handleApprove = useCallback(async () => {
        try {
            const tx = await approve(
                usdcContract,
                lendingMarketContract,
                account
            );
            return tx;
        } catch (e) {
            return false;
        }
    }, [account, usdcContract, lendingMarketContract]);

    return { onApprove: handleApprove };
};

export default useApprove;
