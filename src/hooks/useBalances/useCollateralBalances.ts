import { useMemo } from 'react';
import { useBalances, useCollateralCurrencies } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export const useCollateralBalances = () => {
    const balances = useBalances();
    const { data: collateralCurrencies } = useCollateralCurrencies();

    return useMemo(() => {
        const result: Partial<Record<CurrencySymbol, number>> = {};
        collateralCurrencies?.forEach(ccy => (result[ccy] = balances[ccy]));

        return result;
    }, [balances, collateralCurrencies]);
};
