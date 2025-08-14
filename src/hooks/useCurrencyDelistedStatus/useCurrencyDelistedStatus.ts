import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { useCurrencies } from '../useCurrencies';

export const defaultDelistedStatusSet: Set<CurrencySymbol> = new Set();

export const useCurrencyDelistedStatus = () => {
    const securedFinance = useSF();
    const { data: currencies = [] } = useCurrencies();

    return useQuery({
        queryKey: [QueryKeys.CURRENCY_EXISTS, currencies],
        queryFn: async () => {
            const currencyExistList = await Promise.all(
                currencies.map(symbol =>
                    securedFinance?.currencyExists(toCurrency(symbol)),
                ),
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
        enabled: !!securedFinance && currencies.length > 0,
    });
};
