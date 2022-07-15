import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useRegisterUser = (
    addresses: string[] = [],
    chainIds: number[] | BigNumber[] = []
) => {
    const securedFinance = useSF();

    const handleRegisterUser = useCallback(async () => {
        if (!securedFinance) {
            return;
        }

        let tx;
        if (addresses.length > 0) {
            tx = await securedFinance.registerUserWithCrosschainAddresses(
                addresses,
                chainIds
            );
        } else {
            tx = await securedFinance.registerUser();
        }
        return tx;
    }, [addresses, chainIds, securedFinance]);

    return { onRegisterUser: handleRegisterUser };
};
