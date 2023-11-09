import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI } from 'src/utils';

type ValueLockedBook = Record<CurrencySymbol, bigint>;

export const emptyValueLockedBook: ValueLockedBook = {
    [CurrencySymbol.ETH]: ZERO_BI,
    [CurrencySymbol.USDC]: ZERO_BI,
    [CurrencySymbol.WFIL]: ZERO_BI,
    [CurrencySymbol.WBTC]: ZERO_BI,
};

export const useValueLockedByCurrency = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.PROTOCOL_DEPOSIT_AMOUNT],
        queryFn: async () => {
            const value = await securedFinance?.getProtocolDepositAmount();
            return (value as ValueLockedBook) ?? emptyValueLockedBook;
        },
        enabled: !!securedFinance,
    });
};
