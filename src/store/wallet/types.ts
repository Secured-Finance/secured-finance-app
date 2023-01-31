import { zeroBalances } from 'src/hooks/useEthWallet';
import { CurrencySymbol } from 'src/utils';

export interface WalletsStore {
    address: string;
    balances: Record<CurrencySymbol, number>;
}

export const defaultWallet: WalletsStore = {
    address: '',
    balances: zeroBalances,
};
