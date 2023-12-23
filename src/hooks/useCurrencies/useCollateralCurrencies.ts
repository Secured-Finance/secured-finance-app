import { useQuery } from '@tanstack/react-query';
import { CurrencySymbol, currencyMap, hexToCurrencySymbol } from 'src/utils';
import { useNetwork } from 'wagmi';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useCollateralCurrencies = () => {
    const securedFinance = useSF();
    const { chain } = useNetwork();

    return useQuery({
        queryKey: [QueryKeys.COLLATERAL_CURRENCIES, chain?.id],
        queryFn: async () => {
            const currencies = await securedFinance?.getCollateralCurrencies();
            return currencies ?? [];
        },
        select: currencies =>
            currencies
                .map(hexToCurrencySymbol)
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined)
                .sort((a, b) => currencyMap[a].index - currencyMap[b].index),
        enabled: !!securedFinance && !!chain,
        staleTime: Infinity,
    });
};
