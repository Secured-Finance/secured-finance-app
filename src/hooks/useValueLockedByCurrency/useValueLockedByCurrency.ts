import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI, createCurrencyMap } from 'src/utils';

type ValueLockedBook = Record<CurrencySymbol, bigint>;

export const emptyValueLockedBook: ValueLockedBook =
    createCurrencyMap<bigint>(ZERO_BI);

export const useValueLockedByCurrency = (chainId?: number) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.PROTOCOL_DEPOSIT_AMOUNT, chainId],
        queryFn: async () => {
            const value =
                await securedFinance?.getProtocolDepositAmount(chainId);
            return (value as ValueLockedBook) ?? emptyValueLockedBook;
        },
        enabled: !!securedFinance,
    });
};
