import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export const useDecimals = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.PRICE_DECIMALS],
        queryFn: async () => {
            return await Promise.all(
                Object.values(CurrencySymbol).map(async ccy => {
                    return [
                        ccy,
                        (await securedFinance?.getDecimals(toCurrency(ccy))) ??
                            0,
                    ] as [CurrencySymbol, number];
                })
            );
        },
        select: data => {
            return data.reduce((acc, [ccy, decimal]) => {
                try {
                    acc[ccy] = decimal;
                } catch (e) {
                    acc[ccy] = 0;
                }

                return acc;
            }, {} as Record<CurrencySymbol, number>);
        },
        enabled: !!securedFinance,
        staleTime: Infinity,
    });
};
