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
            const currencies = getCurrencyMapAsList().map(c => c.symbol);
            const currencyExistList = await Promise.all(
                currencies.map(symbol =>
                    securedFinance?.currencyExists(toCurrency(symbol))
                )
            );

            return currencyExistList.reduce(
                (delistedStatus, currencyExist, index) => ({
                    ...delistedStatus,
                    [currencies[index]]: !currencyExist,
                }),
                defaultDelistedStatusMap
            );
        },
        initialData: defaultDelistedStatusMap,
        enabled: !!securedFinance,
    });
};
