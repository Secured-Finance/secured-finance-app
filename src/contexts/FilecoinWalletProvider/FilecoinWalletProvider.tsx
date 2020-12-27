import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Network as FilNetwork } from "@glif/filecoin-address"

import { providers } from '../../services/filecoin/providers'

export const Context = createContext({
	isLoaded: false,
})

interface FilecoinWalletProviderProps {
	children: ReactNode,
	ntwk?: FilNetwork.MAIN | FilNetwork.TEST
}

const FilecoinWasmProvider: React.FC<FilecoinWalletProviderProps> = ({ children, ntwk }) => {
	const [wasmModule, setWasmModule] = useState<any>()
	const [loaded, setLoaded] = useState<boolean>(false)
	const [filProviders, setFilProviders] = useState<any>()

	useEffect(() => {
		async function loadWasmModule() {
			try {
				const wasm = await import("@zondax/filecoin-signing-tools")
				await setWasmModule(wasm)
				await setLoaded(true)
				await setFilProviders(providers(wasm))
			} catch (err) {
				await setLoaded(false)
				console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
			}
		}
		loadWasmModule()
	}, [setWasmModule, setLoaded, setFilProviders, providers])

	return <Context.Provider value={{ ...wasmModule, loaded, filProviders, isLoaded: true }}>{children}</Context.Provider>
}

export default FilecoinWasmProvider