import { Token } from '@secured-finance/sf-core';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { ZERO_BI, currencyMap } from 'src/utils';
import { useCurrencies } from '../useCurrencies';

export const useERC20Balance = (address: string | undefined) => {
    const securedFinance = useSF();
    const { data } = useCurrencies(true);

    const tokens = useMemo(() => {
        return (
            data
                ?.filter(ccy => currencyMap[ccy].toCurrency().isToken)
                ?.map(ccy => currencyMap[ccy]) ?? []
        );
    }, [data]);

    return useQueries({
        queries: tokens.map(token => {
            return {
                queryKey: [QueryKeys.TOKEN_BALANCE, token.symbol, address],
                queryFn: async () => {
                    const balance = await securedFinance?.getERC20Balance(
                        token.toCurrency() as Token,
                        address ?? ''
                    );
                    return balance ?? ZERO_BI;
                },
                select: (balance: bigint) => {
                    return [token.symbol, balance];
                },
                enabled: !!securedFinance && !!address && tokens.length > 0,
            };
        }),
    });
};
