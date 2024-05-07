import { BigNumber as BigNumberJS } from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { connectWallet, resetWallet, updateBalance } from 'src/store/wallet';
import { useAccount, useBalance, usePublicClient } from 'wagmi';

export const useWalletStore = () => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({
        address,
        watch: true,
    });
    const publicClient = usePublicClient();
    const decimals = publicClient.chain.nativeCurrency.decimals;

    const nativeCurrencyBalance = balance?.value
        ? new BigNumberJS(balance.value.toString())
              .dividedBy(10 ** decimals)
              .toNumber()
        : 0;
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    useEffect(() => {
        if (isConnected && address) {
            dispatch(connectWallet(address));
        } else {
            dispatch(resetWallet());
        }
    }, [address, dispatch, isConnected]);

    useEffect(() => {
        if (isConnected && address) {
            dispatch(updateBalance(nativeCurrencyBalance));
        }
    }, [address, dispatch, isConnected, nativeCurrencyBalance, block]);
};
