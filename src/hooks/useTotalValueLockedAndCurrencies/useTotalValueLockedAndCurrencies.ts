import { useMemo } from 'react';
import {
    emptyValueLockedBook,
    useCollateralCurrencies,
    useCurrencies,
    useLastPrices,
    useValueLockedByCurrency,
} from 'src/hooks';
import { ZERO_BI, currencyMap } from 'src/utils';

export const useTotalValueLockedAndCurrencies = () => {
    const { data: currencies = [] } = useCurrencies();
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();
    const { data: valueLockedByCurrency = emptyValueLockedBook } =
        useValueLockedByCurrency();
    const { data: priceList } = useLastPrices();

    const currenciesSet = new Set(currencies);
    const extraCollateralCurrencies = collateralCurrencies.filter(
        element => !currenciesSet.has(element)
    );

    const currenciesInvolved = useMemo(
        () => [...currencies, ...extraCollateralCurrencies],
        [currencies, extraCollateralCurrencies]
    );

    const totalValueLockedInUSD = useMemo(() => {
        let val = ZERO_BI;
        if (!valueLockedByCurrency) {
            return val;
        }
        for (const ccy of currenciesInvolved ?? []) {
            if (!valueLockedByCurrency[ccy]) continue;
            val = BigInt(
                Math.floor(
                    currencyMap[ccy].fromBaseUnit(valueLockedByCurrency[ccy]) *
                        priceList[ccy]
                )
            );
        }

        return val;
    }, [priceList, valueLockedByCurrency, currenciesInvolved]);

    return { totalValueLockedInUSD, currencies: currenciesInvolved };
};
