import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, currencyMap, hexToCurrencySymbol } from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useCurrencies = (showAll = false, chainId?: number) => {
    const securedFinance = useSF();
    const { address } = useSelector((state: RootState) => state.wallet);

    return useQuery({
        queryKey: [
            QueryKeys.CURRENCIES,
            securedFinance?.config.chain.id,
            chainId,
            address,
        ],
        queryFn: async () => {
            const [currenciesResult, usedCurrenciesResult] = await Promise.all([
                securedFinance?.getCurrencies(chainId),
                address
                    ? securedFinance?.tokenVault.getUsedCurrencies(address)
                    : Promise.resolve([]),
            ]);

            return Array.from(
                new Set([
                    ...(currenciesResult ?? []),
                    ...(usedCurrenciesResult ?? []),
                ])
            );
        },
        select: currencies => {
            return currencies
                .map(hexToCurrencySymbol)
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
