import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export const useMinimumPreOrderAmount = (
    ccy: CurrencySymbol,
    enabled = true
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [
            QueryKeys.MINIMUM_PRE_ORDER_AMOUNT,
            ccy,
            securedFinance?.config.chain.id,
        ],
        queryFn: async () => {
            const minimumPreOrderAmount =
                await securedFinance?.getMinPreOrderAmount(toCurrency(ccy));
            if (minimumPreOrderAmount === undefined) {
                throw new Error('Minimum pre-order amount is unavailable');
            }

            return minimumPreOrderAmount;
        },
        enabled: !!securedFinance && enabled,
    });
};
