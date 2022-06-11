import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { ethers } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { useFilecoinWalletStore } from 'src/hooks/useFilWallet';
import { FIL_ADDRESS, FIL_WALLET_TYPE } from 'src/services/filecoin';
import { hexToDec } from 'src/utils';
import { ChainUnsupportedError, useWallet } from 'use-wallet';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

export interface SFContext {
    securedFinance?: SecuredFinanceClient;
}

export const Context = createContext<SFContext>({
    securedFinance: undefined,
});

declare global {
    interface Window {
        securedFinanceSDK: SecuredFinanceClient;
    }
}

const SecuredFinanceProvider: React.FC = ({ children }) => {
    const { error, status, connect, account, ethereum } = useWallet();
    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();

    const filAddr = localStorage.getItem(FIL_ADDRESS);
    const filWalletType = localStorage.getItem(FIL_WALLET_TYPE);

    useFilecoinWalletStore(filAddr, filWalletType);
    useEthereumWalletStore();

    const handleNetworkChanged = (networkId: string) => {
        if (hexToDec(networkId) !== 4) {
            alert('Unsupported network, please use Rinkeby (Chain ID: 4)');
        }
    };

    useEffect(() => {
        const connectSFClient = async (chainId: number) => {
            const provider = new ethers.providers.Web3Provider(
                ethereum,
                chainId
            );
            const network = await provider.getNetwork();

            const securedFinanceLib = new SecuredFinanceClient(
                provider,
                network
            );

            setSecuredFinance(securedFinanceLib);
            window.securedFinanceSDK = securedFinanceLib;
        };
        if (ethereum) {
            const chainId = Number(ethereum.chainId);
            connectSFClient(chainId);
            ethereum.on('chainChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener(
                        'chainChanged',
                        handleNetworkChanged
                    );
                }
            };
        } else {
            if (status === 'error') {
                if (error instanceof ChainUnsupportedError) {
                    alert(
                        'Unsupported network, please use Ropsten (Chain ID: 1337'
                    );
                }
            }
        }
    }, [ethereum, status, error]);

    useEffect(() => {
        if (account) {
            return;
        }
        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect('injected');
        }
    }, [connect, account]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
