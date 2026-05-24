import { useQuery } from '@tanstack/react-query';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import { CurrencySymbol, ZERO_BI, toCurrency } from 'src/utils';
import { useCurrencies } from '../useCurrencies';
import { useTokenVaultCurrencies } from '../useTokenVaultCurrencies';

const DECIMALS = 8;

export const useLastPrices = (chainId?: number) => {
    const securedFinance = useSF();
    const { address } = useSelector((state: RootState) => state.wallet);
    const { data: currenciesResult = [], isSuccess: isCurrencySuccess } =
        useCurrencies(true, chainId);
    const { data: tokenVaultCurrencies = [] } =
        useTokenVaultCurrencies(address);
    const currencies = Array.from(
        new Set([...currenciesResult, ...tokenVaultCurrencies])
    );

    return useQuery({
        queryKey: [QueryKeys.LAST_PRICES, currencies, chainId],
        queryFn: async () => {
            if (!currencies) return [];
            return await Promise.all(
                currencies.map(async ccy => {
                    return [
                        ccy,
                        (await securedFinance?.getLastPrice(
                            toCurrency(ccy),
                            chainId
                        )) ?? ZERO_BI,
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
                [CurrencySymbol.USDC, ZERO_BI],
                [CurrencySymbol.aUSDC, ZERO_BI],
                [CurrencySymbol.ETH, ZERO_BI],
                [CurrencySymbol.WETHe, ZERO_BI],
                [CurrencySymbol.WBTC, ZERO_BI],
                [CurrencySymbol.BTCb, ZERO_BI],
                [CurrencySymbol.FIL, ZERO_BI],
                [CurrencySymbol.tFIL, ZERO_BI],
                [CurrencySymbol.WFIL, ZERO_BI],
                [CurrencySymbol.axlFIL, ZERO_BI],
                [CurrencySymbol.iFIL, ZERO_BI],
                [CurrencySymbol.wpFIL, ZERO_BI],
                [CurrencySymbol.JPYC, ZERO_BI],
                [CurrencySymbol.UMINT, ZERO_BI],
                [CurrencySymbol.ISNR, ZERO_BI],
            ] as [CurrencySymbol, bigint][],
        enabled: !!securedFinance && isCurrencySuccess,
    });
};
