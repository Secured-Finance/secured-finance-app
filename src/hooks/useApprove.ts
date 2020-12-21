import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { approve, getMoneyMarketContract, getUsdcContract } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

const useApprove = () => {
	const securedFinance = useSF()
	const { account }: { account: string; ethereum: provider } = useWallet()
	const usdcContract = getUsdcContract(securedFinance)
	const moneyMarketContract = getMoneyMarketContract(securedFinance)

	const handleApprove = useCallback(async () => {
		try {
			const tx = await approve(usdcContract, moneyMarketContract, account)
			return tx
		} catch (e) {
			return false
		}
	}, [account, usdcContract, moneyMarketContract])

	return { onApprove: handleApprove }
}

export default useApprove
