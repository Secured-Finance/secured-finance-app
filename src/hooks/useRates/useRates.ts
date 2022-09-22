import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, Rate, toCurrency } from 'src/utils';
import useSF from '../useSecuredFinance';

export enum RateType {
    Borrow = 0,
    Lend = 1,
    MidRate = 2,
}
export const useRates = (ccy: CurrencySymbol, type: RateType) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [rates, setRates] = useState<BigNumber[]>([]);

    const fetchYieldCurve = useCallback(
        async (securedFinance: SecuredFinanceClient) => {
            const currency = toCurrency(ccy);
            let ratesFn;
            switch (type) {
                case RateType.Borrow:
                    ratesFn = () =>
                        securedFinance.getBorrowYieldCurve(currency);
                    break;
                case RateType.Lend:
                    ratesFn = () => securedFinance.getLendYieldCurve(currency);
                    break;
                case RateType.MidRate:
                    ratesFn = () =>
                        securedFinance.getMidRateYieldCurve(currency);
                    break;
                default:
                    ratesFn = () => Promise.resolve([]);
                    break;
            }
            setRates(await ratesFn());
        },
        [type, ccy]
    );

    useEffect(() => {
        if (securedFinance) {
            fetchYieldCurve(securedFinance);
        }
    }, [fetchYieldCurve, securedFinance, block]);

    return rates.map(rate => new Rate(rate.toNumber()));
};
