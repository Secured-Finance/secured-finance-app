import { useMemo } from 'react';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';
import { useBalances } from './useBalances';

export const useCollateralBalances = () => {
    const result: Partial<Record<CurrencySymbol, number>> = {};
    const balances = useBalances();

    const collateralCurrencies = useMemo(
        () => getCurrencyMapAsList().filter(ccy => ccy.isCollateral),
        []
    );
    collateralCurrencies.forEach(
        ccy => (result[ccy.symbol] = balances[ccy.symbol])
    );

    return result;
};
