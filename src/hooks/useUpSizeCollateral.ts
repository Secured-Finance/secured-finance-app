import { useCallback } from 'react';
import { useWallet } from 'use-wallet';

import { upSizeEth, getCollateralContract } from '../services/sdk/utils';
import useSF from './useSecuredFinance';

export const useUpsizeCollateral = (amount: number) => {
    const securedFinance = useSF();
    const { account } = useWallet();
    const collateralContract = getCollateralContract(securedFinance);

    const handleUpSizeCollateral = useCallback(async () => {
        try {
            const tx = await upSizeEth(collateralContract, account, amount);
            return tx;
        } catch (e) {
            return false;
        }
    }, [account, collateralContract, amount]);

    return { onUpsizeCollateral: handleUpSizeCollateral };
};
