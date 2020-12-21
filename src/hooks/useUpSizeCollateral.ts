import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { upSizeEth, upSizeFil, getCollateralContract } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useUpsizeCollateral = (amount: number, currency: number) => {
    const securedFinance = useSF()
    const { account }: { account: string; ethereum: provider } = useWallet()
    const collateralContract = getCollateralContract(securedFinance)
  
    const handleUpSizeCollateral = useCallback(async () => {
      try {
        let tx: any
        switch (currency) {
            case 0:
                tx = await upSizeEth(collateralContract, account, amount)
                break
            case 1:
                tx = await upSizeFil(collateralContract, account, amount)
                break
            default:
                break
        }    
        return tx
      } catch (e) {
        return false
      }
    }, [account, collateralContract, amount, currency])
  
    return { onUpsizeCollateral: handleUpSizeCollateral }
}
