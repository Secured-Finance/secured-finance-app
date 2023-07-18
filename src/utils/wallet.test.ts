import {
    readWalletFromStore,
    removeWalletFromStore,
    writeWalletInStore,
} from './wallet';

describe('wallet', () => {
    const wallet = 'MetaMask';

    beforeEach(() => {
        localStorage.clear();
    });

    describe('writeWalletInStore', () => {
        it('should write the wallet to localStorage', () => {
            writeWalletInStore(wallet);
            expect(localStorage.getItem('CACHED_PROVIDER_KEY')).toEqual(
                JSON.stringify(wallet)
            );
        });
    });

    describe('readWalletFromStore', () => {
        it('should read the wallet from localStorage', () => {
            localStorage.setItem('CACHED_PROVIDER_KEY', JSON.stringify(wallet));
            expect(readWalletFromStore()).toEqual(wallet);
        });

        it('should return undefined if the wallet is not in localStorage', () => {
            expect(readWalletFromStore()).toBeUndefined();
        });
    });

    describe('removeWalletFromStore', () => {
        it('should remove the wallet from localStorage', () => {
            localStorage.setItem('CACHED_PROVIDER_KEY', JSON.stringify(wallet));
            removeWalletFromStore();
            expect(localStorage.getItem('CACHED_PROVIDER_KEY')).toBeNull();
        });
    });
});
