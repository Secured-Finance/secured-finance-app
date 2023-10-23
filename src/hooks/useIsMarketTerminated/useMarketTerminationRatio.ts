import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    ZERO_BN,
    divide,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';

export const useMarketTerminationRatio = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_RATIO],
        queryFn: async () => {
            const currencies =
                (await securedFinance?.getCollateralCurrencies()) ?? [];
            const currencyList = currencies
                .map(ccy => hexToCurrencySymbol(ccy))
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);
            return Promise.all(
                currencyList.map(async ccy => {
                    return {
                        currency: ccy,
                        ratio:
                            (await securedFinance?.getMarketTerminationRatio(
                                toCurrency(ccy)
                            )) ?? ZERO_BN,
                    };
                })
            );
        },
        enabled: !!securedFinance,
        select: ratios => {
            const total = ratios.reduce((acc, { ratio }) => {
                return acc.add(ratio);
            }, ZERO_BN);

            return ratios.map(({ currency, ratio }) => {
                return {
                    currency,
                    ratio: divide(ratio.toNumber(), total.toNumber()) * 10000,
                };
            });
        },
        placeholderData: [],
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};
