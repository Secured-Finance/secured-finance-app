import { useMemo } from 'react';
import { useCollateralCurrencies } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { useFullBalances } from './useFullBalances';

export const useCollateralBalances = () => {
    const fullBalances = useFullBalances();
    const { data: collateralCurrencies } = useCollateralCurrencies();

    return useMemo(() => {
        const result: Partial<Record<CurrencySymbol, bigint>> = {};
        collateralCurrencies?.forEach(ccy => (result[ccy] = fullBalances[ccy]));

        return result;
    }, [fullBalances, collateralCurrencies]);
};
