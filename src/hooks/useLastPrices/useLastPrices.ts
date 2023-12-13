import { useQuery } from '@tanstack/react-query';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI, toCurrency } from 'src/utils';
import { useCurrencies } from '../useCurrencies';

const DECIMALS = 8;

export const useLastPrices = () => {
    const securedFinance = useSF();
    const { data: currencies } = useCurrencies();

    return useQuery({
        queryKey: [QueryKeys.LAST_PRICES, currencies],
        queryFn: async () => {
            if (!currencies) return [];
            return await Promise.all(
                currencies.map(async ccy => {
                    return [
                        ccy,
                        (await securedFinance?.getLastPrice(toCurrency(ccy))) ??
                            ZERO_BI,
                    ] as [CurrencySymbol, bigint];
                })
            );
        },
        select: data => {
            return data.reduce((acc, [ccy, price]) => {
                try {
                    acc[ccy] = new BigNumberJS(price.toString())
                        .dividedBy(10 ** DECIMALS)
                        .toNumber();
                } catch (e) {
                    acc[ccy] = 0;
                }

                return acc;
            }, {} as Record<CurrencySymbol, number>);
        },
        initialData: () =>
            [
                [CurrencySymbol.WBTC, ZERO_BI],
                [CurrencySymbol.ETH, ZERO_BI],
                [CurrencySymbol.USDC, ZERO_BI],
                [CurrencySymbol.WFIL, ZERO_BI],
                [CurrencySymbol.aUSDC, ZERO_BI],
                [CurrencySymbol.axlFIL, ZERO_BI],
            ] as [CurrencySymbol, bigint][],

        enabled: !!securedFinance,
    });
};
