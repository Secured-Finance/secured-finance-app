import { Token } from '@secured-finance/sf-core';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    ZERO_BI,
    amountFormatterFromBase,
    getCurrencyMapAsList,
} from 'src/utils';

export const useERC20Balance = (address: string | undefined) => {
    const securedFinance = useSF();
    const tokens = useMemo(
        () => getCurrencyMapAsList().filter(ccy => ccy.toCurrency().isToken),
        []
    );

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
                    return [
                        token.symbol,
                        amountFormatterFromBase[token.symbol](balance),
                    ];
                },
                enabled: !!securedFinance && !!address,
            };
        }),
    });
};
