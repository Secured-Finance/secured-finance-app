import { reset as resetTracking } from '@amplitude/analytics-browser';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetWallet } from 'src/store/wallet';
import { Wallet } from 'src/types';
import {
    getSupportedChainIds,
    removeWalletFromStore,
    writeWalletInStore,
} from 'src/utils';
import { Connector, useAccount, useDisconnect, useNetwork } from 'wagmi';

function hasMetaMask() {
    if (typeof window === 'undefined') {
        return false;
    }
    return typeof window.ethereum !== 'undefined';
}

export const useWalletConnection = () => {
    const { isConnected, connector, address } = useAccount();
    const { disconnect, reset } = useDisconnect();
    const { chain } = useNetwork();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isConnected && connector && address) {
            handlePostConnection(connector, address, chain?.id);
        } else if (!isConnected) {
            handlePostDisconnection();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, connector, address, chain?.id]);

    const handlePostConnection = async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connector: Connector<any, any>,
        account: string,
        currentChainId?: number
    ) => {
        try {
            const supportedChainId = getSupportedChainIds();
            const selectedChainId = Number(searchParams?.get('chain_id'));

            // Your existing logic
            if (connector.name === 'MetaMask' && hasMetaMask()) {
                if (supportedChainId.includes(selectedChainId)) {
                    await connector.switchChain?.(selectedChainId);
                } else if (!supportedChainId.includes(currentChainId || 0)) {
                    await connector.switchChain?.(supportedChainId[0]);
                }
            }

            writeWalletInStore(connector.name as Wallet);

            // eslint-disable-next-line no-console
            console.log('Wallet connected:', {
                connector: connector.name,
                account,
            });
        } catch (error) {
            console.error('Post-connection setup failed:', error);
        }
    };

    const handlePostDisconnection = () => {
        resetTracking();
        reset();
        disconnect();
        dispatch(resetWallet());
        removeWalletFromStore();
    };
};
