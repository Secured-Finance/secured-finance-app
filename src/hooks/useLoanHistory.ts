import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getLoanContract, getLoansHistory } from '../services/sdk/utils'
import useSF from './useSecuredFinance'
import useBlock from './useBlock'
import { HistoryTableData, Schedule } from '../store/history/types'
import { RootState } from '../store/types';
import { failSetLendingHistory, setLendingHistory, startSetLendingHistory } from '../store/history';

interface LoansHistory {
    isValue: boolean
    loans: HistoryTableData[]
}

const useLoanHistory = () => {
    const { account, ethereum}: { account: string; ethereum: provider } = useWallet()
    const securedFinance = useSF()
    const block = useBlock()
    const loanContract = getLoanContract(securedFinance)
    
    const lendingHistory = useSelector((state: RootState) => state.history.lendingHistory);
    const dispatch = useDispatch();  
    
    const fetchLoanHistory = useCallback(async () => {
            dispatch(startSetLendingHistory())
            const history: Promise<LoansHistory> = await getLoansHistory(loanContract, account)
            let parsedHistory: Array<HistoryTableData> = []
            try {
                for (var i = 0; i < (await history).loans.length; i++) {
                    const loanObj = Object.assign({},(await history).loans[i]) 
                    parsedHistory.push(loanObj)
                }
                    await dispatch(setLendingHistory(parsedHistory))
            }
            catch (err) {
                dispatch(failSetLendingHistory())
                console.log(err)
            }
	}, [dispatch, loanContract, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && loanContract) {
			fetchLoanHistory()
        }
        return () => { isMounted = false };
	}, [block, loanContract, dispatch, securedFinance])
    
	return lendingHistory
}

export default useLoanHistory
