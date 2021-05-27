import { Network } from '@glif/filecoin-address';
import { BigNumber } from '@glif/filecoin-number';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletAccountModal from '../components/WalletAccountModal';
import { useResetFilWalletProvider } from '../services/filecoin';
import { RootState } from '../store/types';
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
} from '../store/wallets';
import { useFilUsd } from './useAssetPrices';
import useFilWasm from './useFilWasm';
import useModal from './useModal';
import {
    updateFilWalletViaProvider,
    updateFilWalletViaRPC,
} from '../store/wallets/helpers';
import { getFilUSDBalance } from '../store/wallets/selectors';

export const useFilecoinAddress = () => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinAddr = useSelector(
        (state: RootState) => state.wallets.filecoin.address
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(
        async (isMounted: boolean) => {
            await dispatch(fetchWallet());
            if (loaded && walletProvider != null) {
                const [filAddr] = await walletProvider.wallet.getAccounts(
                    0,
                    1,
                    Network.TEST
                );
                dispatch(updateFilWalletAddress(filAddr));
            } else {
                dispatch(fetchWalletFailure());
            }
        },
        [dispatch, loaded, walletProvider]
    );

    useEffect(() => {
        let isMounted = true;
        fetchFilStore(isMounted);
        return () => {
            isMounted = false;
        };
    }, [dispatch, walletProvider]);

    return filecoinAddr;
};

export const useFilecoinBalance = () => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinBalance = useSelector(
        (state: RootState) => state.wallets.filecoin.balance
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(
        async (isMounted: boolean) => {
            await dispatch(fetchWallet());
            if (loaded && walletProvider != null) {
                const [filAddr] = await walletProvider.wallet.getAccounts(
                    0,
                    1,
                    Network.TEST
                );
                const balance = await walletProvider.getBalance(filAddr);
                dispatch(updateFilWalletBalance(balance.toNumber()));
            } else {
                dispatch(fetchWalletFailure());
            }
        },
        [dispatch, loaded, walletProvider]
    );

    useEffect(() => {
        let isMounted = true;
        fetchFilStore(isMounted);
        return () => {
            isMounted = false;
        };
    }, [dispatch, walletProvider]);

    return filecoinBalance;
};

export const useFilecoinUSDBalance = async () => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinUSDBalance = useSelector(
        (state: RootState) => state.wallets.filecoin.usdBalance
    );
    const filUSDPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(
        async (isMounted: boolean) => {
            await dispatch(fetchWallet());

            if (loaded && walletProvider != null && filUSDPrice != 0) {
                const [filAddr] = await walletProvider.wallet.getAccounts(
                    0,
                    1,
                    Network.TEST
                );
                const balance = await walletProvider.getBalance(filAddr);
                let usdBalance = new BigNumber(balance.toFil())
                    .times(new BigNumber(filUSDPrice))
                    .toNumber();
                dispatch(updateFilWalletUSDBalance(usdBalance));
            } else {
                dispatch(fetchWalletFailure());
            }
        },
        [dispatch, loaded, walletProvider]
    );

    useEffect(() => {
        let isMounted = true;
        fetchFilStore(isMounted);
        return () => {
            isMounted = false;
        };
    }, [dispatch, walletProvider]);

    return filecoinUSDBalance;
};

export const useFilecoinWalletStore = () => {
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
    const actObj = {
        send: onPresentAccountModal,
        placeCollateral: onPresentAccountModal,
        signOut: useResetFilWalletProvider,
    };

    const fetchFilStore = useCallback(
        async (isMounted: boolean) => {
            dispatch(updateFilWalletAssetPrice(price));
            dispatch(updateFilWalletDailyChange(change));
            dispatch(updateFilWalletViaProvider(walletProvider));
            dispatch(updateFilWalletActions(actObj));
        },
        [dispatch, price, totalUSDBalance, loaded, walletProvider, change]
    );

    useEffect(() => {
        (async () => {
            let isMounted = true;
            if (
                loaded &&
                totalUSDBalance != 0 &&
                walletProvider != null &&
                price != 0 &&
                change != 0
            ) {
                await fetchFilStore(isMounted);
            }

            return () => {
                isMounted = false;
            };
        })();
    }, [dispatch, loaded, totalUSDBalance, walletProvider, price, change]);

    useEffect(() => {
        // fetch FIL wallet info when not connected
        (async () => {
            const filAddr = localStorage.getItem('FIL_ADDRESS');
            if (filAddr && !walletProvider) {
                dispatch(updateFilWalletViaRPC(filAddr));
            }
        })();
    }, []);

    useEffect(() => {
        if (price !== 0 || change !== 0) {
            dispatch(updateFilWalletAssetPrice(price));
            dispatch(updateFilWalletDailyChange(change));
        }
    }, [price, change]);

    useEffect(() => {
        // update portfolio share on totalUSDBalance change
        let portfolioShare =
            totalUSDBalance === 0
                ? 0
                : new BigNumber(usdBalance)
                      .times(100)
                      .dividedBy(new BigNumber(totalUSDBalance))
                      .toNumber();
        dispatch(updateFilWalletPortfolioShare(portfolioShare));
    }, [totalUSDBalance]);

    return filWallet;
};
