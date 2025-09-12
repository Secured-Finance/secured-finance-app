import { useMemo } from 'react';
import {
    emptyValueLockedBook,
    useCollateralCurrencies,
    useCurrencies,
    useLastPrices,
    useValueLockedByCurrency,
} from 'src/hooks';
import { ZERO_BI, AmountConverter } from 'src/utils';

export const useTotalValueLockedAndCurrencies = () => {
    const { data: currencies = [] } = useCurrencies();
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();
    const { data: valueLockedByCurrency = emptyValueLockedBook } =
        useValueLockedByCurrency();
    const { data: priceList } = useLastPrices();

    const currenciesInvolved = useMemo(
        () => Array.from(new Set([...currencies, ...collateralCurrencies])),
        [collateralCurrencies, currencies]
    );

    const totalValueLockedInUSD = useMemo(() => {
        let val = ZERO_BI;
        if (!valueLockedByCurrency) {
            return val;
        }
        for (const ccy of currenciesInvolved ?? []) {
            if (!valueLockedByCurrency[ccy]) continue;
            val += BigInt(
                Math.floor(
                    AmountConverter.fromBase(valueLockedByCurrency[ccy], ccy) *
                        (priceList[ccy] ?? 0)
                )
            );
        }

        return val;
    }, [priceList, valueLockedByCurrency, currenciesInvolved]);

    return { totalValueLockedInUSD, currencies: currenciesInvolved };
};
