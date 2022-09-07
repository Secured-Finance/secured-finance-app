export interface WalletsStore {
    totalUSDBalance: number;
    ethereum: WalletBase;
}

export interface WalletBase {
    ccyIndex: number;
    address: string;
    balance: number;
    usdBalance: number;
    assetPrice: number;
    portfolioShare: number;
    dailyChange: number;
}
export type Coin = 'filecoin' | 'ethereum' | 'usdc';

export const defaultEthWallet = {
    ccyIndex: 0,
    address: '',
    balance: 0,
    usdBalance: 0,
    assetPrice: 0,
    portfolioShare: 0,
    dailyChange: 0,
};
