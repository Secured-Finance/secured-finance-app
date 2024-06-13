import { columns, mobileColumns } from './constants';

const combined = [...columns, ...mobileColumns];

export enum CurrencyCategories {
    USDC = 'USDC',
    ETH = 'ETH',
    WBTC = 'WBTC',
    FILFVM = 'FIL (FVM)',
}

export type ColumnKey = (typeof combined)[number]['key'];
