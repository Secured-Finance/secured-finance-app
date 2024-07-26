import { Option } from 'src/components/atoms';
import { CurrentMarket } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export type AdvancedLendingTopBarProp = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<Maturity>>;
    selected: Option<Maturity>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: Maturity) => void;
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
