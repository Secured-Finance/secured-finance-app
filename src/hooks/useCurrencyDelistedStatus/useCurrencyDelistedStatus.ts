import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, getCurrencyMapAsList, toCurrency } from 'src/utils';

export const defaultDelistedStatusSet: Set<CurrencySymbol> = new Set();

export const useCurrencyDelistedStatus = () => {
    const securedFinance = useSF();
    const currencies = useMemo(
        () => getCurrencyMapAsList().map(c => c.symbol),
        []
    );

    return useQuery({
        queryKey: [QueryKeys.CURRENCY_EXISTS],
        queryFn: async () => {
            const currencyExistList = await Promise.all(
                currencies.map(symbol =>
                    securedFinance?.currencyExists(toCurrency(symbol))
                )
            );

            const delistedStatusSet: Set<CurrencySymbol> = new Set();

            currencyExistList.forEach((currencyExist, index) => {
                if (!currencyExist) {
                    delistedStatusSet.add(currencies[index]);
                }
            });

            return delistedStatusSet;
        },
        initialData: defaultDelistedStatusSet,
        enabled: !!securedFinance,
    });
};
