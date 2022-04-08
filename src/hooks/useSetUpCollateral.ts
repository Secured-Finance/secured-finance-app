import { useCallback } from 'react';
import { toBytes32 } from 'src/utils/strings';
import { useWallet } from 'use-wallet';
import { getCollateralContract, setUpCollateral } from '../services/sdk/utils';
import useSF from './useSecuredFinance';

export const useSetUpCollateral = (
    amount: number,
    id: string,
    filAddr: string
) => {
    const securedFinance = useSF();
    const { account } = useWallet();
    const collateralContract = getCollateralContract(securedFinance);

    const handleSetUpCollateral = useCallback(async () => {
        try {
            const tx = await setUpCollateral(
                collateralContract,
                id,
                toBytes32(filAddr),
                account,
                amount
            );
            return tx;
        } catch (e) {
            return false;
        }
    }, [account, collateralContract, amount, id, filAddr]);

    return { onSetUpCollateral: handleSetUpCollateral };
};
