import { useQuery } from '@tanstack/react-query';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { QueryKeys } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    ZERO_BI,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';

export const useMarketTerminationRatio = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [
            QueryKeys.TERMINATION_RATIO,
            securedFinance?.config.chain.id,
        ],
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
                            )) ?? ZERO_BI,
                    };
                })
            );
        },
        enabled: !!securedFinance,
        select: ratios => {
            const total = ratios.reduce((acc, { ratio }) => {
                return acc + ratio;
            }, ZERO_BI);

            return ratios.map(({ currency, ratio }) => {
                return {
                    currency,
                    ratio: new BigNumberJS(ratio.toString())
                        .dividedBy(new BigNumberJS(total.toString()))
                        .multipliedBy(10000)
                        .dp(0)
                        .toNumber(),
                };
            });
        },
        placeholderData: [],
        staleTime: Infinity,
    });
};
