import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { CurrencySymbol, hexToCurrencySymbol, toCurrency } from 'src/utils';

export const useTerminationPrices = () => {
    const securedFinance = useSF();
    //TODO: add prices of non collateral tokens
    // TODO: use BigNumber instead of number
    return useQuery({
        queryKey: [QueryKeys.TERMINATION_PRICES],
        queryFn: async () => {
            const currencies =
                (await securedFinance?.getCollateralCurrencies()) ?? [];
            const currencyList = currencies
                .map(ccy => hexToCurrencySymbol(ccy))
                .filter((ccy): ccy is CurrencySymbol => ccy !== undefined);
            const prices = await Promise.all(
                currencyList.map(async ccy => {
                    return (
                        ((
                            await securedFinance?.getMarketTerminationPrice(
                                toCurrency(ccy)
                            )
                        )?.toNumber() ?? 0) / 1e8
                    );
                })
            );

            const assetPriceMap: AssetPriceMap = currencyList.reduce(
                (acc, ccy, index) => {
                    return {
                        ...acc,
                        [ccy]: prices[index],
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
