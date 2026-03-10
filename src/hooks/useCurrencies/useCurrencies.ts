import { useQuery } from '@tanstack/react-query';
import {
    CurrencySymbol,
    currencyMap,
    getDelistedCurrencies,
    hexToCurrencySymbol,
    toCurrencySymbol,
} from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useCurrencies = (showAll = false, chainId?: number) => {
    const securedFinance = useSF();
    return useQuery({
        queryKey: [
            QueryKeys.CURRENCIES,
            securedFinance?.config.chain.id,
            chainId,
        ],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies(chainId);
            return currencies ?? [];
        },
        select: currencies => {
            const activeCurrencies = currencies
                .map(hexToCurrencySymbol)
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);

            const delistedCurrencies = getDelistedCurrencies(
                chainId ?? securedFinance?.config.chain.id
            )
                .map(toCurrencySymbol)
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);

            // Merge and remove duplicates
            const allCurrencies = Array.from(
                new Set([...activeCurrencies, ...delistedCurrencies])
            );

            return allCurrencies
                .filter(
                    (ccy): ccy is CurrencySymbol =>
                        ccy !== undefined &&
                        (showAll || currencyMap[ccy].hasOrderBook)
                )
                .sort((a, b) => currencyMap[a].index - currencyMap[b].index);
        },
        enabled: !!securedFinance,
        staleTime: Infinity,
    });
};
