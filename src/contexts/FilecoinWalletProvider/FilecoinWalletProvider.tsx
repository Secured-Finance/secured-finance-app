import React, { createContext, useEffect, useState } from 'react'
import { Network as FilNetwork } from "@glif/filecoin-address"

import { FilecoinWallet } from '../../services/filecoin'

export interface FWContext {
  filecoinWallet?: typeof FilecoinWallet
}

export const Context = createContext<FWContext>({
  filecoinWallet: undefined,
})

declare global {
  interface Window {
    filWallet: any
  }
}

const FilecoinWalletProvider: React.FC = ({ children }) => {
  const [filecoinWallet, setFilecoinWallet] = useState<any>()

  // @ts-ignore
  window.filecoinWallet = filecoinWallet

  useEffect(() => {
      const network = FilNetwork.TEST
      const filWallet = new FilecoinWallet(null, network)
      setFilecoinWallet(filWallet)
      window.filWallet = filWallet
  }, [])

  return <Context.Provider value={{ filecoinWallet }}>{children}</Context.Provider>
}

export default FilecoinWalletProvider
