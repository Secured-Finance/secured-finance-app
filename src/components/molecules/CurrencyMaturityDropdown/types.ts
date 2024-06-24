import { desktopColumns, mobileColumns } from './constants';

const combined = [...desktopColumns, ...mobileColumns];

export enum CurrencyCategories {
    USDC = 'USDC',
    ETH = 'ETH',
    WBTC = 'WBTC',
    FILFVM = 'FIL (FVM)',
}

export type ColumnKey = (typeof combined)[number]['key'];
