import { useContext } from 'react'
import { Context } from '../contexts/FilecoinWalletProvider'

const useFilWallet = () => {
    const { filecoinWallet } = useContext(Context)
    return filecoinWallet
}

export default useFilWallet
