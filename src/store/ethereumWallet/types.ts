export interface WalletsStore {
    address: string;
    balance: number;
    usdBalance: number;
}

export const defaultEthWallet: WalletsStore = {
    address: '',
    balance: 0,
    usdBalance: 0,
};
