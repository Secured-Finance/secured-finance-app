export interface WalletsStore {
    address: string;
    balance: number;
    usdBalance: number;
    assetPrice: number;
    portfolioShare: number;
    dailyChange: number;
}

export const defaultEthWallet = {
    address: '',
    balance: 0,
    usdBalance: 0,
    assetPrice: 0,
    portfolioShare: 0,
    dailyChange: 0,
};
