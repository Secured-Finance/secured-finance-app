import { Option } from 'src/components/atoms';
import { CurrentMarket } from 'src/types';
import { CurrencySymbol } from 'src/utils';

export type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: T) => void;
    currentMarket: CurrentMarket | undefined;
    currencyPrice: string;
    marketInfo?: {
        high: string;
        low: string;
        volume: string;
        rateHigh: string;
        rateLow: string;
        isIncreased?: boolean;
    };
};
