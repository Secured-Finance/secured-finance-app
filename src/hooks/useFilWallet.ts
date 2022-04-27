import { BigNumber } from '@glif/filecoin-number';
import Filecoin from '@glif/filecoin-wallet-provider';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { WalletAccountModal } from 'src/components/organisms';
import { useResetFilWalletProvider } from 'src/services/filecoin';
import { getFilecoinNetwork } from 'src/services/filecoin/utils';
import connectWithLedger from 'src/services/ledger/connectLedger';
import { RootState } from 'src/store/types';
import {
    fetchWallet,
    fetchWalletFailure,
    updateFilWalletActions,
    updateFilWalletAddress,
    updateFilWalletAssetPrice,
    updateFilWalletBalance,
    updateFilWalletDailyChange,
    updateFilWalletPortfolioShare,
    updateFilWalletUSDBalance,
    WalletBase,
} from 'src/store/wallets';
import { FIL_ADDRESS } from 'src/store/wallets/constants';
import {
    updateFilWalletViaProvider,
    updateFilWalletViaRPC,
} from 'src/store/wallets/helpers';
import { getFilUSDBalance } from 'src/store/wallets/selectors';
import { useFilUsd } from './useAssetPrices';
import useFilWasm from './useFilWasm';
import useModal from './useModal';

export const useFilecoinWalletInfo = () => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const {
        address: filecoinAddr,
        usdBalance: filecoinUSDBalance,
        balance: filecoinBalance,
    } = useSelector((state: RootState) => state.wallets.filecoin);

    const fileCoinUSDPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    // TODO: add filecoin USD balance hook call
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const updateFilStore = async (
        dispatch: Dispatch,
        wasmLoaded: boolean,
        walletProvider: Filecoin,
        filUSDPrice: number = null
    ) => {
        dispatch(fetchWallet());
        if (wasmLoaded && walletProvider !== null) {
            const [filAddr] = await walletProvider.wallet.getAccounts(
                0,
                1,
                getFilecoinNetwork()
            );
            dispatch(updateFilWalletAddress(filAddr));

            const balance = await walletProvider.getBalance(filAddr);
            dispatch(updateFilWalletBalance(balance.toNumber()));

            if (filUSDPrice) {
                const usdBalance = new BigNumber(balance.toFil())
                    .times(new BigNumber(filUSDPrice))
                    .toNumber();
                dispatch(updateFilWalletUSDBalance(usdBalance));
            }
        } else {
            dispatch(fetchWalletFailure());
        }
    };

    const fetchFilStore = useCallback(
        async () =>
            await updateFilStore(
                dispatch,
                loaded,
                walletProvider,
                fileCoinUSDPrice
            ),
        [dispatch, loaded, walletProvider, fileCoinUSDPrice]
    );

    useEffect(() => {
        fetchFilStore();
    }, [fetchFilStore]);

    return {
        filecoinAddr,
        filecoinUSDBalance,
        fileCoinUSDPrice,
        filecoinBalance,
    };
};

export const useFilecoinWalletStore = (): WalletBase => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const { price, change } = useFilUsd();
    const filWallet = useSelector((state: RootState) => state.wallets.filecoin);
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const totalUSDBalance = useSelector(
        (state: RootState) => state.wallets.totalUSDBalance
    );
    const usdBalance = useSelector(getFilUSDBalance);
    const [onPresentAccountModal] = useModal(WalletAccountModal);
    const actObj = useMemo(() => {
        return {
            send: onPresentAccountModal,
            placeCollateral: onPresentAccountModal,
            signOut: useResetFilWalletProvider,
        };
    }, [onPresentAccountModal]);
    const filAddr = localStorage.getItem(FIL_ADDRESS);

    const fetchFilStore = useCallback(async () => {
        if (!loaded || walletProvider === null) {
            return;
        }

        dispatch(updateFilWalletViaProvider(walletProvider, filAddr));
        dispatch(updateFilWalletActions(actObj));
    }, [walletProvider, loaded, dispatch, actObj, filAddr]);

    useEffect(() => {
        (async () => {
            await fetchFilStore();
        })();
    }, [fetchFilStore]);

    useEffect(() => {
        // fetch FIL wallet info when not connected

        (async () => {
            if (filAddr && !walletProvider) {
                dispatch(updateFilWalletAddress(filAddr));

                // connect FIL wallet if address is stored
                const provider = await connectWithLedger(dispatch);
                if (!provider) {
                    dispatch(updateFilWalletViaRPC(filAddr));
                }

                dispatch(updateFilWalletActions(actObj));
            }
        })();
    }, [actObj, dispatch, filAddr, walletProvider]);

    useEffect(() => {
        if (price !== 0 || change !== 0) {
            dispatch(updateFilWalletAssetPrice(price));
            dispatch(updateFilWalletDailyChange(change));
        }
    }, [price, change, dispatch]);

    useEffect(() => {
        // update portfolio share on totalUSDBalance change
        const portfolioShare =
            totalUSDBalance === 0
                ? 0
                : new BigNumber(usdBalance)
                      .times(100)
                      .dividedBy(new BigNumber(totalUSDBalance))
                      .toNumber();
        dispatch(updateFilWalletPortfolioShare(portfolioShare));
    }, [dispatch, totalUSDBalance, usdBalance]);

    return filWallet;
};
