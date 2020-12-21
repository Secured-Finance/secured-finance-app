import BigNumber from "bignumber.js"
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getCollateralContract, setUpCollateral } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useSetUpCollateral = (amount: number, id: string, filAddr: string) => {
    const securedFinance = useSF()
    const { account }: { account: string; ethereum: provider } = useWallet()
    const collateralContract = getCollateralContract(securedFinance)
  
    const handleSetUpCollateral = useCallback(async () => {
		try {
			let tx: any
			tx = await setUpCollateral(collateralContract, id, filAddr, account, amount)
			return tx
		} catch (e) {
			return false
		}
    }, [account, collateralContract, amount, id, filAddr])
  
    return { onSetUpCollateral: handleSetUpCollateral }
}
