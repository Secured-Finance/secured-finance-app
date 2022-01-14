import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { upSizeEth, getCollateralContract } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useUpsizeCollateral = (amount: number) => {
    const securedFinance = useSF()
    const { account }: { account: string; ethereum: provider } = useWallet()
    const collateralContract = getCollateralContract(securedFinance)
  
    const handleUpSizeCollateral = useCallback(async () => {
      try {
        let tx = await upSizeEth(collateralContract, account, amount)
        return tx
      } catch (e) {
        return false
      }
    }, [account, collateralContract, amount])
  
    return { onUpsizeCollateral: handleUpSizeCollateral }
}
