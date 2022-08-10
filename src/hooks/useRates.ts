import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, toCurrency } from 'src/utils';
import useSF from './useSecuredFinance';

export const useRates = (ccy: CurrencySymbol, type: number) => {
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
                case 0:
                    ratesFn = () =>
                        securedFinance.getBorrowYieldCurve(currency);
                    break;
                case 1:
                    ratesFn = () => securedFinance.getLendYieldCurve(currency);
                    break;
                case 2:
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

    return rates.map(rate => rate.toNumber());
};
