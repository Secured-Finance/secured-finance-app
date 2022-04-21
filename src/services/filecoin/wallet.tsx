import { Network } from '@glif/filecoin-address';
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilWallet } from 'src/store/wallets/helpers';
import useFilWasm from '../../hooks/useFilWasm';
import { RootState } from '../../store/types';
import { resetFilWallet } from '../../store/wallets';
import {
    failFetchingFilWalletProvider,
    resetFilWalletProvider,
    setFilWalletProvider,
    setFilWalletType,
    startFetchingFilWalletProvider,
} from './store';

export const useResetFilWalletProvider = () => {
    localStorage.setItem('mnemonic', null);
    localStorage.setItem('privateKey', null);
    const dispatch = useDispatch();

    const handleResetProvider = useCallback(async () => {
        dispatch(startFetchingFilWalletProvider());
        try {
            dispatch(resetFilWalletProvider());
            dispatch(resetFilWallet());
        } catch (e) {
            dispatch(failFetchingFilWalletProvider());
        }
    }, [dispatch]);

    return { onReset: handleResetProvider };
};

export const useNewFilWalletProvider = () => {
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();

    const handleCreateFilWalletProvider = useCallback(
        async (
            provider: WalletSubProvider,
            providerType: string,
            network: Network = Network.TEST
        ) => {
            dispatch(startFetchingFilWalletProvider());
            if (loaded && walletProvider === null) {
                const config = {
                    apiAddress:
                        network === Network.MAIN
                            ? 'http://api.node.glif.io/rpc/v0'
                            : 'https://calibration.node.glif.io/rpc/v0',
                };
                const filecoin = new Filecoin(provider, config);
                dispatch(setFilWalletProvider(filecoin));
                dispatch(setFilWalletType(providerType));
                const [filAddr] = await provider.getAccounts(
                    0,
                    1,
                    Network.TEST
                );
                const balance = await filecoin.getBalance(filAddr);

                dispatch(updateFilWallet(balance, filAddr));
            } else {
                dispatch(failFetchingFilWalletProvider());
            }
        },
        [dispatch, loaded, walletProvider]
    );

    return { onCreate: handleCreateFilWalletProvider };
};

export const useDefaultWallet = (
    network: Network = Network.TEST
): {
    address: string;
    balance: number;
} => {
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function compute() {
            if (walletProvider != null) {
                const [filAddr] = await walletProvider.wallet.getAccounts(
                    0,
                    1,
                    network
                );
                setAddress(filAddr);
                const filBal = await walletProvider.getBalance(filAddr);
                setBalance(filBal.toNumber());
            }
        }
        compute();
    }, [network, setAddress, setBalance, walletProvider]);

    return { address, balance };
};
