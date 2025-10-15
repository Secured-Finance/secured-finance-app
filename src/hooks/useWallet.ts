import { useEffect } from 'react';
import { useBlockchainStore, useWalletStore } from 'src/store';
import { useAccount, useBalance } from 'wagmi';

export const useWallet = () => {
    const { connectWallet, resetWallet, updateBalance } = useWalletStore();
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({
        address,
        watch: true,
    });
    const { latestBlock: block } = useBlockchainStore();

    useEffect(() => {
        if (isConnected && address) {
            connectWallet(address);
        } else {
            resetWallet();
        }
    }, [address, connectWallet, resetWallet, isConnected]);

    useEffect(() => {
        if (isConnected && address) {
            updateBalance(balance?.value.toString() || '0');
        }
    }, [address, updateBalance, isConnected, balance, block]);
};
