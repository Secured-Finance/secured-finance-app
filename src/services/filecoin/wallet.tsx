import { Network } from '@glif/filecoin-address';
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { useCallback } from 'react';
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
import { FilecoinWalletType } from './store/types';
import { FIL_JSON_RPC_ENDPOINT } from './utils';

export const FIL_ADDRESS = 'FIL_ADDRESS';
export const FIL_WALLET_TYPE = 'FIL_WALLET_TYPE';

export const useResetFilWalletProvider = () => {
    const dispatch = useDispatch();

    const handleResetProvider = useCallback(async () => {
        resetLocalStorage();
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
            providerType: FilecoinWalletType,
            network: Network = Network.TEST
        ) => {
            dispatch(startFetchingFilWalletProvider());
            if (loaded && walletProvider === null) {
                const config = {
                    apiAddress: FIL_JSON_RPC_ENDPOINT[network],
                };
                const filecoin = new Filecoin(provider, config);
                dispatch(setFilWalletProvider(filecoin));
                dispatch(setFilWalletType(providerType));
                const [filAddr] = await provider.getAccounts(0, 1, network);

                setLocalStorage(filAddr, providerType);

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

function setLocalStorage(filAddr: string, providerType: FilecoinWalletType) {
    localStorage.setItem(FIL_ADDRESS, filAddr);
    localStorage.setItem(FIL_WALLET_TYPE, providerType.toString());
}

function resetLocalStorage() {
    localStorage.removeItem(FIL_ADDRESS);
    localStorage.removeItem(FIL_WALLET_TYPE);
}
