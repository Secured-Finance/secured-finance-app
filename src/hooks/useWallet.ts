import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { connectWallet, resetWallet, updateBalance } from 'src/store/wallet';
import { useAccount, useBalance } from 'wagmi';

export const useWalletStore = () => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({
        address,
        watch: true,
    });
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
            dispatch(updateBalance(balance?.value.toString() || '0'));
        }
    }, [address, dispatch, isConnected, balance, block]);
};
