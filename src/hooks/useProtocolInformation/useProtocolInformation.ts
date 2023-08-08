import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BN } from 'src/utils';

type ValueLockedBook = Record<CurrencySymbol, BigNumber>;

export const emptyValueLockedBook: ValueLockedBook = {
    [CurrencySymbol.ETH]: ZERO_BN,
    [CurrencySymbol.USDC]: ZERO_BN,
    [CurrencySymbol.WFIL]: ZERO_BN,
    [CurrencySymbol.WBTC]: ZERO_BN,
};

export const useTotalNumberOfAsset = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.CURRENCIES],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies();
            return currencies ?? [];
        },
        select: currencies => currencies.length,
        enabled: !!securedFinance,
    });
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
