import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCurrencyControllerRead } from 'src/generated/wagmi';
import {
    currencyMap,
    CurrencySymbol,
    hexToCurrencySymbol,
    useHookSwitcher,
} from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

// Legacy implementation using secured finance SDK
const useCurrenciesLegacy = (showAll = false, chainId?: number) => {
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

// New wagmi implementation using generated hooks
const useCurrenciesWagmi = (showAll = false, chainId?: number) => {
    const {
        data: rawCurrencies,
        isLoading,
        error,
    } = useCurrencyControllerRead({
        functionName: 'getCurrencies',
        chainId:
            chainId as keyof typeof import('src/generated/wagmi').currencyControllerAddress,
        staleTime: Infinity,
    });

    const currencies = useMemo(() => {
        if (!rawCurrencies) return [];
        return rawCurrencies
            .map(hexToCurrencySymbol)
            .filter(
                (ccy): ccy is CurrencySymbol =>
                    ccy !== undefined &&
                    (showAll || currencyMap[ccy].hasOrderBook)
            )
            .sort((a, b) => currencyMap[a].index - currencyMap[b].index);
    }, [rawCurrencies, showAll]);

    return { data: currencies, isLoading, error } as UseQueryResult<
        CurrencySymbol[],
        DefaultError
    >;
};

// Main hook with feature flag switching
export const useCurrencies = (showAll = false, chainId?: number) => {
    const legacyResult = useCurrenciesLegacy(showAll, chainId);
    const wagmiResult = useCurrenciesWagmi(showAll, chainId);

    return useHookSwitcher(
        'currencies',
        () => legacyResult,
        () => wagmiResult
    );
};
