import { CurrencySymbol } from 'src/utils';

export interface AssetPrice {
    price: number;
    change: number;
}

export type AssetPrices = Record<CurrencySymbol, AssetPrice> & {
    isLoading: boolean;
};
