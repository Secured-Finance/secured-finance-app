import { useQuery } from '@tanstack/react-query';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { QueryKeys } from 'src/hooks';
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

    return useQuery({
        queryKey: [
            QueryKeys.TERMINATION_PRICES,
            securedFinance?.config.chain.id,
        ],
        queryFn: async () => {
            const currencies = (await securedFinance?.getCurrencies()) ?? [];
            const currencyList = currencies
                .map(ccy => hexToCurrencySymbol(ccy))
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);
            const marketTerminationArray = await Promise.all(
                currencyList.map(async ccy => {
                    return (
                        (await securedFinance?.getMarketTerminationPriceAndDecimals(
                            toCurrency(ccy),
                        )) ?? {
                            price: ZERO_BI,
                            decimals: 0,
                        }
                    );
                }),
            );

            const assetPriceMap: AssetPriceMap = currencyList.reduce(
                (acc, ccy, index) => {
                    const decimals =
                        toCurrency(ccy).decimals -
                        marketTerminationArray[index].decimals -
                        8;
                    return {
                        ...acc,
                        [ccy]: new BigNumberJS(
                            marketTerminationArray[index].price.toString(),
                        )
                            .multipliedBy(10 ** decimals)
                            .toNumber(),
                    };
                },
                {} as AssetPriceMap,
            );

            return assetPriceMap;
        },
        enabled: !!securedFinance,
        staleTime: Infinity,
    });
};
