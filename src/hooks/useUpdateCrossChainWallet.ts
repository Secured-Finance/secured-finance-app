import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useUpdateCrossChainWallet = () => {
    const securedFinance = useSF();

    const registerCrossChainWallet = useCallback(
        async (chainId: number, address: string) => {
            const tx = await securedFinance.updateCrosschainAddress(
                chainId,
                address
            );
            return tx;
        },
        [securedFinance]
    );

    return { onRegisterCrossChainWallet: registerCrossChainWallet };
};
