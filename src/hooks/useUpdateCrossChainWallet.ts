import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useUpdateCrossChainWallet = () => {
    const securedFinance = useSF();

    const registerCrossChainWallet = useCallback(
        async (chainId: number, adress: string) => {
            const tx = await securedFinance.updateCrosschainAddress(
                chainId,
                adress
            );
            return tx;
        },
        [securedFinance]
    );

    return { onRegisterCrossChainWallet: registerCrossChainWallet };
};
