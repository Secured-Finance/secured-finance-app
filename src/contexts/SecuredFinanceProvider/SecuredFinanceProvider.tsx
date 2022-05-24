import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { ethers } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLatestBlock } from 'src/store/blockchain';
import { ChainUnsupportedError, useWallet } from 'use-wallet';
import Web3 from 'web3';

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
    const { ethereum, error, status, connect, account } = useWallet();
    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();
    const dispatch = useDispatch();

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

    useEffect(() => {
        if (account) {
            return;
        }
        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect('injected');
        }
    }, [connect, account]);

    // Update the latest block every 5 seconds
    useEffect(() => {
        if (!ethereum) return;
        const web3 = new Web3(ethereum);

        const interval = setInterval(async () => {
            dispatch(updateLatestBlock(await web3.eth.getBlockNumber()));
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch, ethereum]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
