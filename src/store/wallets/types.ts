export interface WalletsStore {
    totalUSDBalance: number;
    ethereum: WalletBase;
    filecoin: WalletBase;
}

export interface WalletBase {
    ccyIndex: number;
    address: string;
    balance: number;
    usdBalance: number;
    assetPrice: number;
    portfolioShare: number;
    dailyChange: number;
    actions?: {
        send: () => void;
        signOut: () => void;
        placeCollateral: () => void;
    };
}
export type Coin = 'filecoin' | 'ethereum' | 'usdc';

export const supportedCoins: Record<number, Coin> = {
    0: 'ethereum',
    1: 'filecoin',
    2: 'usdc',
};

export const defaultEthWallet = {
    ccyIndex: 0,
    address: '',
    balance: 0,
    usdBalance: 0,
    assetPrice: 0,
    portfolioShare: 0,
    dailyChange: 0,
};

export const defaultFilWallet: WalletBase = {
    ccyIndex: 1,
    address: '',
    balance: 0,
    usdBalance: 0,
    assetPrice: 0,
    portfolioShare: 0,
    dailyChange: 0,
    actions: null,
};
