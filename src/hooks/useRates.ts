import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import useSF from './useSecuredFinance';

export const useRates = (ccy: string, type: number) => {
    const selectedCcy = 'FIL';
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [rates, setRates] = useState<BigNumber[]>([]);

    const fetchYieldCurve = useCallback(async () => {
        let ratesFn;
        switch (type) {
            case 0:
                ratesFn = () => securedFinance.getBorrowYieldCurve(selectedCcy);
                break;
            case 1:
                ratesFn = () => securedFinance.getLendYieldCurve(selectedCcy);
                break;
            case 2:
                ratesFn = () =>
                    securedFinance.getMidRateYieldCurve(selectedCcy);
                break;
            default:
                break;
        }
        setRates(await ratesFn());
    }, [type, securedFinance]);

    useEffect(() => {
        if (securedFinance) {
            fetchYieldCurve();
        }
    }, [block, setRates, ccy, securedFinance, fetchYieldCurve]);

    return rates.map(rate => rate.toNumber());
};
