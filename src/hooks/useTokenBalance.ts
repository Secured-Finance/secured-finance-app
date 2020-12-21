import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getUsdcBalance, getUsdcContract } from '../services/sdk/utils'
import useSF from './useSecuredFinance'
import useBlock from './useBlock'

const useTokenBalance = () => {
	const securedFinance = useSF()
	const usdcContact = getUsdcContract(securedFinance)
	const block = useBlock()
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

	const fetchBalance = useCallback(async () => {
		const balance = await getUsdcBalance(usdcContact, account)
		setBalance(balance)
	}, [account, usdcContact])

	useEffect(() => {
		if (account && ethereum) {
			fetchBalance()
		}
	}, [account, block, ethereum, setBalance, usdcContact])

	return balance
}

export default useTokenBalance
