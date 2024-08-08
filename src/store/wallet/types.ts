export interface WalletsStore {
    address: string;
    balance: string;
}

export const defaultWallet: WalletsStore = {
    address: '',
    balance: '0',
};
