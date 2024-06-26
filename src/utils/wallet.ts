import { Wallet } from 'src/types';

const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

export function writeWalletInStore(wallet: Wallet) {
    localStorage.setItem(CACHED_PROVIDER_KEY, wallet);
}

export function readWalletFromStore(): Wallet | undefined {
    const wallet = localStorage.getItem(CACHED_PROVIDER_KEY);
    return wallet ? (wallet as Wallet) : undefined;
}

export function removeWalletFromStore() {
    localStorage.removeItem(CACHED_PROVIDER_KEY);
}
