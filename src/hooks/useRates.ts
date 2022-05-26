import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import useSF from './useSecuredFinance';

export const useRates = (ccy: string, type: number) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [rates, setRates] = useState<BigNumber[]>([]);

    const fetchYieldCurve = useCallback(async () => {
        let ratesFn;
        switch (type) {
            case 0:
                ratesFn = () => securedFinance.getBorrowYieldCurve(ccy);
                break;
            case 1:
                ratesFn = () => securedFinance.getLendYieldCurve(ccy);
                break;
            case 2:
                ratesFn = () => securedFinance.getMidRateYieldCurve(ccy);
                break;
            default:
                break;
        }
        setRates(await ratesFn());
    }, [type, securedFinance, ccy]);

    useEffect(() => {
        if (securedFinance) {
            fetchYieldCurve();
        }
    }, [fetchYieldCurve, securedFinance, block]);

    return rates.map(rate => rate.toNumber());
};
