import { useContext } from 'react'
import { Context } from '../contexts/SecuredFinanceProvider'

const useSF = () => {
    const { securedFinance } = useContext(Context)
    return securedFinance
}

export default useSF
