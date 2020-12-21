import { useCallback, useEffect, useState } from 'react'

import { getBorrowerRates, getLenderRates, getMidRates } from '../services/sdk/utils'
import useBlock from './useBlock'
import { Contract } from 'web3-eth-contract'

export const useRates = (moneyMarketContract: Contract, type: number) => {
    const block = useBlock()
    const [rates, setRates] = useState(new Array)

    const fetchBorrowRates = useCallback(async (isMounted: boolean) => {
        let rates: Array<any>
        switch (type) {
            case 0:
                rates = await getBorrowerRates(moneyMarketContract)
                break
            case 1:
                rates = await getLenderRates(moneyMarketContract)
                break
            case 2:
                rates = await getMidRates(moneyMarketContract)
                break
            default:
                break
        }    
        await setRates(rates)
    }, [moneyMarketContract])

    useEffect(() => {
        let isMounted = true;
        if (moneyMarketContract) {
            fetchBorrowRates(isMounted)
        }
        return () => { isMounted = false };
    }, [block, setRates, moneyMarketContract])

    return rates
}