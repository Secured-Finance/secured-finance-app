export interface WalletsStore {
    address: string;
    ethBalance: number;
    usdcBalance: number;
}

export const defaultWallet: WalletsStore = {
    address: '',
    ethBalance: 0,
    usdcBalance: 0,
};
