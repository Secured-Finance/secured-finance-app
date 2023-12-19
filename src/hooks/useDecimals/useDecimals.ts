import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { useCurrencies } from '../useCurrencies';

export const useDecimals = () => {
    const securedFinance = useSF();
    const { data: currencies } = useCurrencies();

    return useQuery({
        queryKey: [QueryKeys.PRICE_DECIMALS, currencies],
        queryFn: async () => {
            if (!currencies) return [];
            return await Promise.all(
                currencies.map(async ccy => {
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
