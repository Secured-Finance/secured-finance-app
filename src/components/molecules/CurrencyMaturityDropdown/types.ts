import type { Option } from 'src/components/atoms';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { desktopColumns, mobileColumns } from './constants';

const combined = [...desktopColumns, ...mobileColumns];

export enum CurrencyCategories {
    USDC = 'USDC',
    ETH = 'ETH',
    WBTC = 'WBTC',
    FILFVM = 'FIL (FVM)',
}

export type ColumnKey = (typeof combined)[number]['key'];

export type FilteredOptionsType = {
    key: string;
    display: string;
    currency: CurrencySymbol;
    maturity: Maturity;
}[];

export type CurrencyMaturityDropdownProps = {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: Option<Maturity>[];
    maturity?: Option<Maturity>;
    onChange: (currency: CurrencySymbol, maturity: Maturity) => void;
};
