import { clearError, resetLedgerState } from './state'
import {
    checkLedgerConfiguration,
    setLedgerProvider,
} from './setLedgerProvider'

const connectWithLedger = async (dispatch, LedgerProvider) => {
    dispatch(clearError())
    dispatch(resetLedgerState())
    const provider = await setLedgerProvider(dispatch, LedgerProvider)
    if (!provider) return null
    const configured = await checkLedgerConfiguration(dispatch, provider)
    if (!configured) return null
    return provider
}

export default connectWithLedger
