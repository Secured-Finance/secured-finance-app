export interface WalletsStore {
    address: string;
    balance: number;
}

export const defaultEthWallet: WalletsStore = {
    address: '',
    balance: 0,
};
