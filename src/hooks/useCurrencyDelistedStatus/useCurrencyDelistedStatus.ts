import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, getCurrencyMapAsList, toCurrency } from 'src/utils';

export const defaultDelistedStatusMap: Record<CurrencySymbol, boolean> = {
    [CurrencySymbol.WBTC]: false,
    [CurrencySymbol.WFIL]: false,
    [CurrencySymbol.ETH]: false,
    [CurrencySymbol.USDC]: false,
};

export const useCurrencyDelistedStatus = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.CURRENCY_EXISTS],
        queryFn: async () => {
            const currencyDelistedStatusMap =
                await getCurrencyMapAsList().reduce(
                    async (delistedStatus, currencyInfo) => {
                        const accumulator = await delistedStatus;
                        const ccy = currencyInfo.symbol;
                        const currencyExist =
                            await securedFinance?.currencyExists(
                                toCurrency(ccy)
                            );
                        return {
                            ...accumulator,
                            [ccy]: !currencyExist,
                        };
                    },
                    Promise.resolve(defaultDelistedStatusMap)
                );

            return currencyDelistedStatusMap;
        },
        enabled: !!securedFinance,
    });
};
