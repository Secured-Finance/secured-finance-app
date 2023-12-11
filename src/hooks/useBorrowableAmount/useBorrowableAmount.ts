import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    ZERO_BI,
    amountFormatterFromBase,
    toCurrency,
} from 'src/utils';

export const useBorrowableAmount = (
    address: string | undefined,
    ccy: CurrencySymbol
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.BORROWABLE_AMOUNT, address, ccy],
        queryFn: async () => {
            const amount = await securedFinance?.tokenVault.getBorrowableAmount(
                address ?? '',
                toCurrency(ccy)
            );
            return amount ?? ZERO_BI;
        },
        initialData: ZERO_BI,
        select: (amount: bigint) => amountFormatterFromBase[ccy](amount),
        enabled: !!securedFinance && !!address,
    });
};
