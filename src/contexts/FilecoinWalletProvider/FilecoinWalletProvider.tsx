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
		async function loadWasmModule() {
			try {
				const wasm = await import("@zondax/filecoin-signing-tools")
				return wasm
			} catch (err) {
				console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
			}
		}
		const wasm = loadWasmModule()
		const network = FilNetwork.TEST
		const filWallet = new FilecoinWallet(wasm, null, network)
		setFilecoinWallet(filWallet)
		window.filWallet = filWallet
  }, [])

  return <Context.Provider value={{ filecoinWallet }}>{children}</Context.Provider>
}

export default FilecoinWalletProvider
