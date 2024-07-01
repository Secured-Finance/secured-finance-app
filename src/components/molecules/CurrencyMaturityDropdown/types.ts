import type { Option } from 'src/components/atoms';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { desktopColumns, mobileColumns } from './constants';

const combined = [...desktopColumns, ...mobileColumns];

export type ColumnKey = (typeof combined)[number]['key'];

export type FilteredOption = {
    key: string;
    display: string;
    currency: CurrencySymbol;
    maturity: Maturity;
    lastPrice: string;
    apr: string;
    isItayoseOption: boolean;
    isFavourite: boolean;
};

export type CurrencyMaturityDropdownProps = {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: Option<Maturity>[];
    maturity?: Option<Maturity>;
    onChange: (currency: CurrencySymbol, maturity: Maturity) => void;
    isItayosePage?: boolean;
};
