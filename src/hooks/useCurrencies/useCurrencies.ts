import { useQuery } from '@tanstack/react-query';
import { CurrencySymbol, currencyMap, hexToCurrencySymbol } from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useCurrencies = (showAll = false) => {
    const securedFinance = useSF();
    return useQuery({
        queryKey: [QueryKeys.CURRENCIES, securedFinance?.config.chain.id],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies();
            return currencies ?? [];
        },
        select: currencies =>
            currencies
                .map(hexToCurrencySymbol)
                .filter(
                    (ccy): ccy is CurrencySymbol =>
                        ccy !== undefined &&
                        (showAll || currencyMap[ccy].hasOrderBook)
                )
                .sort((a, b) => currencyMap[a].index - currencyMap[b].index),
        enabled: !!securedFinance,
        staleTime: Infinity,
    });
};
