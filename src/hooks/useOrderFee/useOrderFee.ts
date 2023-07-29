import { useQuery } from '@tanstack/react-query';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BN, divide, toCurrency } from 'src/utils';

export const useOrderFee = (ccy: CurrencySymbol) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: ['orderFee', ccy],
        queryFn: async () => {
            const orderFee = await securedFinance?.getOrderFeeRate(
                toCurrency(ccy)
            );
            return orderFee ?? ZERO_BN;
        },
        initialData: ZERO_BN,
        select: data => divide(data.toNumber(), 100),
        enabled: !!securedFinance,
    });
};
