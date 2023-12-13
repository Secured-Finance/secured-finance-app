import { useQuery } from '@tanstack/react-query';
import { CurrencySymbol, currencyMap, hexToCurrencySymbol } from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useCurrencies = () => {
    const securedFinance = useSF();
    return useQuery({
        queryKey: [QueryKeys.CURRENCIES],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies();
            return currencies ?? [];
        },
        select: currencies =>
            currencies
                .map(hexToCurrencySymbol)
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined)
                .sort((a, b) => currencyMap[a].index - currencyMap[b].index),
        enabled: !!securedFinance,
        staleTime: Infinity,
    });
};
