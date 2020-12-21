import { useCallback, useContext, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getBestBook, getFxRates } from '../services/sdk/utils'
import useBlock from './useBlock'

const useBestBook = (fxMarketContract: Contract) => {
    const block = useBlock()
	const [fxRates, setFxRates] = useState(new Array)
    const { account, ethereum}: { account: string; ethereum: provider } = useWallet()
    
    const fetchFxRates = useCallback(async () => {
        const rates: Array<any> = await getFxRates(fxMarketContract)
		setFxRates(rates)
	}, [fxMarketContract])
    
	useEffect(() => {
		if (fxMarketContract) {
			fetchFxRates()
		}
	}, [block, fxMarketContract, setFxRates])
    
	return fxRates
}

export default useBestBook
