import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI, divide, toCurrency } from 'src/utils';

export const useOrderFee = (ccy: CurrencySymbol) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.ORDER_FEE, ccy],
        queryFn: async () => {
            const orderFee = securedFinance?.getOrderFeeRate(toCurrency(ccy));
            return orderFee ?? ZERO_BI;
        },
        select: fee => divide(Number(fee), 100),
        enabled: !!securedFinance,
    });
};
