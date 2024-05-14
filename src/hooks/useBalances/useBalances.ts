import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, createCurrencyMap, currencyMap } from 'src/utils';
import { useCurrencies } from '../useCurrencies';
import { useERC20Balance } from './useERC20Balance';

export const zeroBalances = createCurrencyMap<number>(0);

export const useBalances = () => {
    const balances: Record<CurrencySymbol, number> = {
        ...zeroBalances,
    };

    const { address, balance } = useSelector(
        (state: RootState) => state.wallet
    );
    const { data: currencies } = useCurrencies(true);

    const nativeCurrency = useMemo(() => {
        const targetCurrency = currencies?.find(
            currency => currencyMap[currency].toCurrency().isNative
        );
        return targetCurrency ? currencyMap[targetCurrency] : undefined;
    }, [currencies]);

    if (nativeCurrency) {
        balances[nativeCurrency.symbol] = balance;
    }

    const balanceQueriesResults = useERC20Balance(address);
    balanceQueriesResults.forEach(value => {
        if (value.data) {
            balances[value.data[0] as CurrencySymbol] = value.data[1] as number;
        }
    });

    return balances;
};
