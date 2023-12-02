import { useQuery } from '@tanstack/react-query';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { QueryKeys, useDecimals } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap } from 'src/types';
import {
    CurrencySymbol,
    ZERO_BI,
    hexToCurrencySymbol,
    toCurrency,
} from 'src/utils';

export const useTerminationPrices = () => {
    const securedFinance = useSF();
    const { data: decimals } = useDecimals();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_PRICES, decimals],
        queryFn: async () => {
            const currencies = (await securedFinance?.getCurrencies()) ?? [];
            const currencyList = currencies
                .map(ccy => hexToCurrencySymbol(ccy))
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);
            const prices = await Promise.all(
                currencyList.map(async ccy => {
                    return (
                        (await securedFinance?.getMarketTerminationPrice(
                            toCurrency(ccy)
                        )) ?? ZERO_BI
                    );
                })
            );

            const assetPriceMap: AssetPriceMap = currencyList.reduce(
                (acc, ccy, index) => {
                    if (decimals === undefined) return acc;
                    return {
                        ...acc,
                        [ccy]: new BigNumberJS(prices[index].toString())
                            .dividedBy(10 ** decimals[ccy])
                            .toNumber(),
                    };
                },
                {} as AssetPriceMap
            );

            return assetPriceMap;
        },
        enabled: !!securedFinance,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};
