export interface WalletsStore {
    address: string;
    balance: number;
}

export const defaultWallet: WalletsStore = {
    address: '',
    balance: 0,
};
