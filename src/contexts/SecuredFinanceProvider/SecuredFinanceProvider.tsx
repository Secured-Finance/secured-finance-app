import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { ethers } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { ChainUnsupportedError, useWallet } from 'use-wallet';

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
    const { ethereum, error, status } = useWallet();
    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.securedFinance = securedFinance;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.eth = ethereum;

    const handleNetworkChanged = (networkId: string | number) => {
        if (networkId !== 3) {
            alert('Unsupported network, please use Ropsten (Chain ID: 3)');
        }
    };

    useEffect(() => {
        const connectSFClient = async (chainId: number) => {
            const provider = new ethers.providers.Web3Provider(
                ethereum,
                chainId
            );
            const signer = provider.getSigner();
            const network = await provider.getNetwork();

            const securedFinanceLib = new SecuredFinanceClient(signer, network);
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

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
