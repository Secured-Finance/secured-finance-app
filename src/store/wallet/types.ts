export interface WalletStore {
    address: string;
    balance: string;
}

export const defaultWalletStore: WalletStore = {
    address: '',
    balance: '0',
};
