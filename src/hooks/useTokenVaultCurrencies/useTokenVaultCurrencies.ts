import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, hexToCurrencySymbol } from 'src/utils';

export const useTokenVaultCurrencies = (account: string | undefined) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.USED_CURRENCIES_FOR_ORDERS, account],
        queryFn: async () => {
            const currencies =
                await securedFinance?.tokenVault.getUsedCurrencies(
                    account ?? ''
                );
            return currencies ?? [];
        },
        select: currencies =>
            currencies
                .map(ccy => hexToCurrencySymbol(ccy))
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined),
        enabled: !!securedFinance && !!account,
    });
};
