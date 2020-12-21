import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { SecuredFinance } from '../../services/sdk'

export interface SFContext {
  securedFinance?: typeof SecuredFinance
}

export const Context = createContext<SFContext>({
  securedFinance: undefined,
})

declare global {
  interface Window {
    securedFinanceSDK: any
  }
}

const SecuredFinanceProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [securedFinance, setSecuredFinance] = useState<any>()

  // @ts-ignore
  window.securedFinance = securedFinance
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const securedFinanceLib = new SecuredFinance(ethereum, chainId, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setSecuredFinance(securedFinanceLib)
      window.securedFinanceSDK = securedFinanceLib
    }
  }, [ethereum])

  return <Context.Provider value={{ securedFinance }}>{children}</Context.Provider>
}

export default SecuredFinanceProvider
