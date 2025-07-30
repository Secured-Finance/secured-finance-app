import { Option } from 'src/components/atoms';
import { CurrentMarket, MarketStats, SavedMarket } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export type AdvancedLendingTopBarProp = {
    selectedAsset: Option<CurrencySymbol>;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<Maturity>>;
    selected: Option<Maturity>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: Maturity) => void;
    currentMarket: CurrentMarket | undefined;
    currencyPrice: number;
    marketStats?: Record<string, MarketStats>;
    savedMarkets: SavedMarket[];
    handleFavouriteToggle: (market: string) => void;
    isItayosePeriod: boolean;
};
