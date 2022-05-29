import { BigNumber } from '@glif/filecoin-number';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletAccountModal } from 'src/components/organisms';
import { useResetFilWalletProvider } from 'src/services/filecoin';
import { FilecoinWalletType } from 'src/services/filecoin/store/types';
import connectWithLedger from 'src/services/ledger/connectLedger';
import { RootState } from 'src/store/types';
import {
    updateFilWalletActions,
    updateFilWalletAssetPrice,
    updateFilWalletDailyChange,
    updateFilWalletPortfolioShare,
} from 'src/store/wallets';
import {
    updateFilWalletViaProvider,
    updateFilWalletViaRPC,
} from 'src/store/wallets/helpers';
import useModal from './useModal';

export const useFilecoinWalletStore = (
    filAddr: string,
    filWalletType: string
) => {
    const dispatch = useDispatch();
    const { price, change } = useSelector(
        (state: RootState) => state.assetPrices.filecoin
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const {
        totalUSDBalance,
        filecoin: { usdBalance },
    } = useSelector((state: RootState) => state.wallets);

    const [onPresentAccountModal] = useModal(WalletAccountModal);
    const actObj = useMemo(() => {
        return {
            send: onPresentAccountModal,
            placeCollateral: onPresentAccountModal,
            signOut: useResetFilWalletProvider,
        };
    }, [onPresentAccountModal]);

    const connectExistingWallet = useCallback(async () => {
        if (!filAddr) return;
        if (filAddr && !walletProvider) {
            if (filWalletType && filWalletType === FilecoinWalletType.Ledger) {
                const ledger = await connectWithLedger(dispatch);
                if (!ledger) {
                    dispatch(updateFilWalletViaProvider(ledger, filAddr));
                }
            } else {
                dispatch(updateFilWalletViaRPC(filAddr));
            }
        } else {
            dispatch(updateFilWalletViaProvider(walletProvider, filAddr));
        }
        dispatch(updateFilWalletActions(actObj));
    }, [actObj, dispatch, filAddr, filWalletType, walletProvider]);

    useEffect(() => {
        connectExistingWallet();
    }, [connectExistingWallet]);

    useEffect(() => {
        if (price !== 0 || change !== 0) {
            dispatch(updateFilWalletAssetPrice(price));
            dispatch(updateFilWalletDailyChange(change));
            const portfolioShare =
                totalUSDBalance === 0
                    ? 0
                    : new BigNumber(usdBalance)
                          .times(100)
                          .dividedBy(new BigNumber(totalUSDBalance))
                          .toNumber();
            dispatch(updateFilWalletPortfolioShare(portfolioShare));
        }
    }, [change, dispatch, price, totalUSDBalance, usdBalance]);
};
