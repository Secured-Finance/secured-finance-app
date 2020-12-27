import { useContext } from 'react'
import { Context } from '../contexts/FilecoinWalletProvider'

const useFilWasm = () => {
    const wasm:any = useContext(Context)
    return wasm
}

export default useFilWasm
