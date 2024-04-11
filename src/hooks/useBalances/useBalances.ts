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

    const { address, ethBalance } = useSelector(
        (state: RootState) => state.wallet
    );
    const { data } = useCurrencies(true);

    const nativeCurrencies = useMemo(() => {
        return (
            data
                ?.filter(ccy => currencyMap[ccy].toCurrency().isNative)
                ?.map(ccy => currencyMap[ccy]) ?? []
        );
    }, [data]);

    nativeCurrencies.forEach(currency => {
        balances[currency.symbol] = ethBalance;
    });

    const balanceQueriesResults = useERC20Balance(address);
    balanceQueriesResults.forEach(value => {
        if (value.data) {
            balances[value.data[0] as CurrencySymbol] = value.data[1] as number;
        }
    });

    return balances;
};
