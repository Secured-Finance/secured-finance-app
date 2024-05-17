import { columns, mobileColumns } from './constants';

const combined = [...columns, ...mobileColumns];

export enum CurrencyMaturityCategories {
    All = 'All',
    Favourites = 'Favourites',
    Itayose = 'Itayose',
    USDC = 'USDC',
    ETH = 'ETH',
    WBTC = 'WBTC',
    FILFVM = 'FIL (FVM)',
}

export type ColumnKey = (typeof combined)[number]['key'];
