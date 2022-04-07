import { Network } from '@glif/filecoin-address';
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    const { loaded } = useFilWasm();

    const handleResetProvider = useCallback(async () => {
        await dispatch(startFetchingFilWalletProvider());
        try {
            await dispatch(resetFilWalletProvider());
            await dispatch(resetFilWallet());
        } catch (e) {
            console.log(e);
            await dispatch(failFetchingFilWalletProvider());
        }
    }, [loaded, dispatch]);

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
            await dispatch(startFetchingFilWalletProvider());
            if (loaded && walletProvider == null) {
                const config = {
                    apiAddress:
                        network === Network.MAIN
                            ? 'http://api.node.glif.io/rpc/v0'
                            : 'https://calibration.node.glif.io/rpc/v0',
                };
                const filecoin = await new Filecoin(provider, config);
                await dispatch(setFilWalletProvider(filecoin));
                await dispatch(setFilWalletType(providerType));
            } else {
                await dispatch(failFetchingFilWalletProvider());
            }
        },
        [loaded, walletProvider]
    );

    return { onCreate: handleCreateFilWalletProvider };
};

export const useDefaultWallet = (network: Network = Network.TEST) => {
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
    }, [setAddress, setBalance]);

    return { address, balance };
};
