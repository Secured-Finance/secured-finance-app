import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { provider } from 'web3-core'

import { getLoanContract, executeLoan } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useExecuteLoan = (makerAddr: string, side: number, currency: number, term: number, amount: number) => {
	const securedFinance = useSF()
	const { account }: { account: string; ethereum: provider } = useWallet()
	const loanContract = getLoanContract(securedFinance)
	
	const handleExecuteLoan = useCallback(async () => {
		try {
			let tx: any
			tx = await executeLoan(loanContract, account, makerAddr, side, currency, term, amount)
			return tx
		} catch (e) {
				return false
		}
	}, [loanContract, account, makerAddr, side, currency, term, amount])
  
	return { onLoanDeal: handleExecuteLoan }
}
