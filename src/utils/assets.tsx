import { DelistingChip, Option } from 'src/components/atoms';
import { CurrencySymbol, getCurrencyMapAsList } from './currencyList';

export const getCurrencyMapAsOptions = (
    delistingStatus?: Record<CurrencySymbol, boolean>
) => {
    return getCurrencyMapAsList().map<Option<CurrencySymbol>>(
        ({ symbol, icon }) => ({
            value: symbol,
            label: symbol,
            iconSVG: icon,
            ...(delistingStatus?.[symbol] ? { chip: <DelistingChip /> } : {}),
        })
    );
};
