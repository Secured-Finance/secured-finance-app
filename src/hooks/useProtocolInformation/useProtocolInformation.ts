import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { CurrencySymbol, ZERO_BN } from 'src/utils';
import useSF from '../useSecuredFinance';

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
        queryKey: ['getCurrencies'],
        queryFn: async () => {
            const currencies = await securedFinance?.getCurrencies();
            return currencies ?? [];
        },
        initialData: [],
        select: currencies => currencies.length,
        enabled: !!securedFinance,
    });
};

export const useValueLockedByCurrency = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: ['getProtocolDepositAmount'],
        queryFn: async () => {
            const value = await securedFinance?.getProtocolDepositAmount();
            return (value as ValueLockedBook) ?? emptyValueLockedBook;
        },
        initialData: emptyValueLockedBook,
        enabled: !!securedFinance,
    });
};
