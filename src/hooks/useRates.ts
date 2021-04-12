import { useCallback, useEffect, useState } from 'react'

import { getBorrowerRates, getLenderRates, getMidRates } from '../services/sdk/utils'
import useBlock from './useBlock'
import { Contract } from 'web3-eth-contract'

export const useRates = (lendingControllerContract: Contract, type: number, ccy: number) => {
    const block = useBlock()
    const [rates, setRates] = useState(new Array)

    const fetchBorrowRates = useCallback(async (isMounted: boolean) => {
        let rates: Array<any>
        switch (type) {
            case 0:
                rates = await getBorrowerRates(lendingControllerContract, ccy)
                break
            case 1:
                rates = await getLenderRates(lendingControllerContract, ccy)
                break
            case 2:
                rates = await getMidRates(lendingControllerContract, ccy)
                break
            default:
                break
        }
        await setRates(rates)
    }, [lendingControllerContract, ccy])

    useEffect(() => {
        let isMounted = true;
        if (lendingControllerContract) {
            fetchBorrowRates(isMounted)
        }
        return () => { isMounted = false };
    }, [block, setRates, lendingControllerContract, ccy])

    return rates
}