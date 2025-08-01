import type { Option } from 'src/components/atoms';
import { SavedMarket } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { desktopColumns, mobileColumns } from './constants';

export type ColumnKey = (
    | typeof desktopColumns
    | typeof mobileColumns
)[number]['key'];

export type ColumnType = {
    key: string;
    label: string;
    width: string;
    allowsSorting?: boolean;
    className?: string;
    isSubgraphSupported?: boolean;
};

export type FilteredOption = {
    key: string;
    display: string;
    currency: CurrencySymbol;
    maturity: Maturity;
    lastPrice: string;
    apr: string;
    isItayoseOption: boolean;
    isFavourite: boolean;
    volume: number;
};

export type CurrencyMaturityDropdownProps = {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: Option<Maturity>[];
    maturity?: Option<Maturity>;
    onChange: (currency: CurrencySymbol, maturity: Maturity) => void;
    isItayosePage?: boolean;
    volumePerMarket: Record<string, number>;
    savedMarkets?: SavedMarket[];
    handleFavouriteToggle?: (market: string) => void;
};
