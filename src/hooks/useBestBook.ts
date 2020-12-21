import { useCallback, useContext, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getBestBook } from '../services/sdk/utils'
import useBlock from './useBlock'

const useBestBook = (moneyMarketContract: Contract) => {
    const block = useBlock()
	const [bestBook, setBestBook] = useState(new Array)
    const { account, ethereum}: { account: string; ethereum: provider } = useWallet()
    
    const fetchBestBook = useCallback(async () => {
        const bestBook: Array<any> = await getBestBook(moneyMarketContract)
		setBestBook(bestBook)
	}, [moneyMarketContract])
    
	useEffect(() => {
		if (moneyMarketContract && ethereum) {
			fetchBestBook()
		}
	}, [ethereum, block, moneyMarketContract, setBestBook])
    
	return bestBook
}

export default useBestBook
