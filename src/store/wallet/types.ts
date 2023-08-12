export interface WalletsStore {
    address: string;
    ethBalance: number;
}

export const defaultWallet: WalletsStore = {
    address: '',
    ethBalance: 0,
};
