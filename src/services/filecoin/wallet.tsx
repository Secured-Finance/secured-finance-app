import { Network } from '@glif/filecoin-address';
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { useCrosschainAddressById } from '@secured-finance/sf-graph-client';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateCrossChainWallet } from 'src/hooks/useUpdateCrossChainWallet';
import { updateFilWallet } from 'src/store/wallets/helpers';
import { AddressUtils } from 'src/utils';
import { useWallet } from 'use-wallet';
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
import { getFilecoinChainId, getFilecoinNetwork } from './utils';

export type CrossChainWallet = {
    address: string;
    chainID: string;
    [key: string]: unknown;
};

export const useResetFilWalletProvider = () => {
    const dispatch = useDispatch();

    const handleResetProvider = useCallback(async () => {
        localStorage.setItem('FIL_ADDRESS', '');
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
    const { account } = useWallet();
    const { onRegisterCrossChainWallet } = useUpdateCrossChainWallet();

    // TODO: Remove the cast to an object here once the type is fixed in [SF-98]
    const filWalletAddr = useCrosschainAddressById(
        account,
        getFilecoinChainId(getFilecoinNetwork())
    ) as CrossChainWallet;

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
                const [filAddr] = await provider.getAccounts(0, 1, network);

                const crossChainAddress = await registerCrossChainWallet(
                    filWalletAddr,
                    filAddr,
                    onRegisterCrossChainWallet
                );

                const balance = await filecoin.getBalance(crossChainAddress);
                dispatch(updateFilWallet(balance, crossChainAddress));
            } else {
                dispatch(failFetchingFilWalletProvider());
            }
        },
        [
            dispatch,
            filWalletAddr,
            loaded,
            onRegisterCrossChainWallet,
            walletProvider,
        ]
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

export async function registerCrossChainWallet(
    filWalletAddr: CrossChainWallet,
    filAddr: string,
    register: (chainId: number, address: string) => Promise<unknown>
) {
    const chainId = getFilecoinChainId(getFilecoinNetwork());
    if (!filWalletAddr || !filWalletAddr?.address) {
        await register(chainId, filAddr);
        return filAddr;
    } else if (
        filWalletAddr?.address &&
        filWalletAddr.chainID === chainId.toString() &&
        !AddressUtils.equals(filWalletAddr.address, filAddr)
    ) {
        await register(chainId, filAddr);
        return filAddr;
    } else {
        return filWalletAddr.address;
    }
}
