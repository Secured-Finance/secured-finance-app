import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { provider } from 'web3-core'

import { getLendingMarketContract, placeOrder } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const usePlaceOrder = (ccy: number, term: number, side: number, amount: number, rate: number) => {
	const securedFinance = useSF()
	const { account }: { account: string; ethereum: provider } = useWallet()
	const lendingMarket = getLendingMarketContract(securedFinance, ccy, term)
    let deadline = Date.now() + (60 * 60 * 24 * 14)

	const handlePlaceOrder = useCallback(async () => {
		try {
			let tx: any
			tx = await placeOrder(lendingMarket, account, side, amount, rate, deadline)
			return tx
		} catch (e) {
				return false
		}
	}, [lendingMarket, ccy, term, side, amount, rate])
  
	return { onPlaceOrder: handlePlaceOrder }
}
