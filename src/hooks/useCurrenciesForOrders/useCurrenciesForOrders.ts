import { Currency } from '@secured-finance/sf-core';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { hexToCurrencySymbol, toCurrency } from 'src/utils';

export const useCurrenciesForOrders = (account: string | undefined) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.USED_CURRENCIES_FOR_ORDERS, account],
        queryFn: async () => {
            const currencies = await securedFinance?.getUsedCurrenciesForOrders(
                account ?? ''
            );
            return currencies ?? [];
        },
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
        enabled: !!securedFinance && !!account,
    });
};
