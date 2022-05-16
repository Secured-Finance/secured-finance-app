import { Network } from '@glif/filecoin-address';
import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider';
import { useCrosschainAddressById } from '@secured-finance/sf-graph-client';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateCrossChainWallet } from 'src/hooks/useUpdateCrossChainWallet';
import { FIL_ADDRESS, FIL_WALLET_TYPE } from 'src/store/wallets/constants';
import { updateFilWallet } from 'src/store/wallets/helpers';
import { AddressUtils } from 'src/utils';
import { useWallet } from 'use-wallet';
import useFilWasm from '../../hooks/useFilWasm';
import { RootState } from '../../store/types';
import { resetFilWallet } from '../../store/wallets';
import { MAINNET_PATH_CODE } from '../ledger/constants';
import {
    failFetchingFilWalletProvider,
    resetFilWalletProvider,
    setFilWalletProvider,
    setFilWalletType,
    startFetchingFilWalletProvider,
} from './store';
import { FilecoinWalletType } from './store/types';
import {
    FIL_JSON_RPC_ENDPOINT,
    getFilecoinChainId,
    getFilecoinNetwork,
} from './utils';

export type CrossChainWallet = {
    address: string;
    chainID: string;
    [key: string]: unknown;
};

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

                const crossChainAddress = await registerCrossChainWallet(
                    filWalletAddr,
                    filAddr,
                    onRegisterCrossChainWallet
                );
                setLocalStorage(crossChainAddress, providerType);

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

export async function registerCrossChainWallet(
    filWalletAddr: CrossChainWallet,
    filAddr: string,
    register: (chainId: number, address: string) => Promise<unknown>
) {
    try {
        // TODO: For now the protocol does not handle mainnet or testnet. Therefore we use the mainnet path code.
        const chainId = MAINNET_PATH_CODE;
        if (!filWalletAddr?.address) {
            await register(chainId, filAddr);
            return filAddr;
        } else if (
            filWalletAddr.chainID === chainId.toString() &&
            !AddressUtils.equals(filWalletAddr.address, filAddr)
        ) {
            await register(chainId, filAddr);
            return filAddr;
        } else {
            return filWalletAddr.address;
        }
    } catch (e) {
        return filWalletAddr?.address ? filWalletAddr.address : filAddr;
    }
}

function setLocalStorage(filAddr: string, providerType: FilecoinWalletType) {
    localStorage.setItem(FIL_ADDRESS, filAddr);
    localStorage.setItem(FIL_WALLET_TYPE, providerType.toString());
}

function resetLocalStorage() {
    localStorage.removeItem(FIL_ADDRESS);
    localStorage.removeItem(FIL_WALLET_TYPE);
}
