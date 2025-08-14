import { CurrencyOption } from 'src/components/molecules';
import { CurrencySymbol, currencyMap } from './currencyList';

export const toOptions = (
    symbols: CurrencySymbol[] | undefined,
    fallback: CurrencySymbol
) => {
    return (
        symbols
            ?.map(symbol => currencyMap[symbol])
            .sort((a, b) => a.index - b.index)
            .map<CurrencyOption>(ccy => ({
                value: ccy.symbol,
                label: ccy.symbol,
            })) ?? [
            {
                value: fallback,
                label: fallback,
            },
        ]
    );
};
