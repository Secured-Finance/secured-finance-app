import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAsset } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    connectEthWallet,
    resetEthWallet,
    updateEthBalance,
} from 'src/store/wallet';
import { CurrencySymbol, ZERO_BI, amountFormatterFromBase } from 'src/utils';
import { useAccount, useBalance } from 'wagmi';

export const useEthereumWalletStore = () => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({
        address,
        watch: true,
    });
    const ethBalance = amountFormatterFromBase[CurrencySymbol.ETH](
        balance?.value ?? ZERO_BI
    );
    const { price } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    useEffect(() => {
        if (isConnected && address) {
            dispatch(connectEthWallet(address));
        } else {
            dispatch(resetEthWallet());
        }
    }, [address, dispatch, isConnected]);

    useEffect(() => {
        if (isConnected && address) {
            dispatch(updateEthBalance(ethBalance));
        }
    }, [address, dispatch, isConnected, price, ethBalance, block]);
};
