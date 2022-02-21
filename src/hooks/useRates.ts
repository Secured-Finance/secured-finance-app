import { useCallback, useEffect, useState } from 'react';

import {
    getBorrowerRates,
    getLenderRates,
    getMidRates,
} from '../services/sdk/utils';
import useBlock from './useBlock';
import { Contract } from 'web3-eth-contract';

export const useRates = (
    lendingControllerContract: Contract,
    type: number,
    ccy: number | string
) => {
    let selectedCcy = 1;
    const block = useBlock();
    const [rates, setRates] = useState(new Array());

    const fetchBorrowRates = useCallback(
        async (isMounted: boolean) => {
            let rates: Array<any>;
            switch (type) {
                case 0:
                    rates = await getBorrowerRates(
                        lendingControllerContract,
                        selectedCcy
                    );
                    break;
                case 1:
                    rates = await getLenderRates(
                        lendingControllerContract,
                        selectedCcy
                    );
                    break;
                case 2:
                    rates = await getMidRates(
                        lendingControllerContract,
                        selectedCcy
                    );
                    break;
                default:
                    break;
            }
            await setRates(rates);
        },
        [lendingControllerContract, ccy]
    );

    useEffect(() => {
        let isMounted = true;
        if (lendingControllerContract) {
            fetchBorrowRates(isMounted);
        }
        return () => {
            isMounted = false;
        };
    }, [block, setRates, lendingControllerContract, ccy]);

    return rates;
};
