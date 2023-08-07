import { Currency } from '@secured-finance/sf-core';
import { useQuery } from '@tanstack/react-query';
import useSF from 'src/hooks/useSecuredFinance';
import { hexToCurrencySymbol, toCurrency } from 'src/utils';

export const useCurrenciesForOrders = (account: string | undefined) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: ['getUsedCurrenciesForOrders', account],
        queryFn: async () => {
            const currencies = await securedFinance?.getUsedCurrenciesForOrders(
                account ?? ''
            );
            return currencies ?? [];
        },
        initialData: [],
        select: currencies =>
            currencies
                .map(ccy => {
                    const symbol = hexToCurrencySymbol(ccy);
                    const convertedCurrency = symbol
                        ? toCurrency(symbol)
                        : null;
                    return convertedCurrency;
                })
                .filter((ccy): ccy is Currency => ccy !== null),
        enabled: !!securedFinance || !!account,
    });
};
