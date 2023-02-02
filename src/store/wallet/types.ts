import { CurrencySymbol } from 'src/utils';

export const zeroBalances = {
    ETH: 0,
    USDC: 0,
    FIL: 0,
    BTC: 0,
};

export interface WalletsStore {
    address: string;
    balances: Record<CurrencySymbol, number>;
}

export const defaultWallet: WalletsStore = {
    address: '',
    balances: zeroBalances,
};
