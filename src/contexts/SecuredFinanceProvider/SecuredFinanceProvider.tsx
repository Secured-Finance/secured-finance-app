import React, { createContext, useCallback, useEffect, useState } from 'react'

import { ChainUnsupportedError, useWallet } from 'use-wallet'
import WalletErrorModal from '../../components/WalletProviderModal/components/WalletErrorModal'
import useModal from '../../hooks/useModal'

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
  const { ethereum, error, status }: { ethereum: any, error: any, status: any, connect: any } = useWallet()
  const [securedFinance, setSecuredFinance] = useState<any>()

  // @ts-ignore
  window.securedFinance = securedFinance
  // @ts-ignore
  window.eth = ethereum

  const handleNetworkChanged = (networkId: string | number) => {
    if (networkId != 3) {
      alert('Unsupported network, please use Ropsten (Chain ID: 3)');
    }
  }

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

      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }

    } else {
      if (status === 'error') {
        if (error instanceof ChainUnsupportedError) {
            alert('Unsupported network, please use Ropsten (Chain ID: 1337')
        }
      }
    }
  }, [ethereum, status, error])


  return <Context.Provider value={{ securedFinance }}>{children}</Context.Provider>
}

export default SecuredFinanceProvider
