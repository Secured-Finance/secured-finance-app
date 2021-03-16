import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getBorrowHistory, getLoanContract, getLoanInfo, getLoansHistory } from '../services/sdk/utils'
import useSF from './useSecuredFinance'
import useBlock from './useBlock'
import { emptyLoan, HistoryTableData, Schedule } from '../store/history/types'
import { RootState } from '../store/types';
import { failSetBorrowingHistory, failSetLendingHistory, setBorrowingHistory, setLendingHistory, startSetHistory } from '../store/history';

interface LoansHistory {
    isValue: boolean
    loans: HistoryTableData[]
}

const useLoanHistory = () => {
    const { account}: { account: string } = useWallet()
    const securedFinance = useSF()
    const block = useBlock()
    const loanContract = getLoanContract(securedFinance)
    
    const lendingHistory = useSelector((state: RootState) => state.history.lendingHistory);
    const dispatch = useDispatch();  
    
    const fetchLoanHistory = useCallback(async () => {
        dispatch(startSetHistory())
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
		if (securedFinance && loanContract && account) {
			fetchLoanHistory()
        }
        return () => { isMounted = false };
	}, [block, loanContract, dispatch, securedFinance, account])
    
	return lendingHistory
}

export default useLoanHistory

export const useLoanState = (id: any) => {
    const [loanInfo, setLoanInfo] = useState(emptyLoan)
    const securedFinance = useSF()
    const block = useBlock()
    const loanContract = getLoanContract(securedFinance)
        
    const fetchLoanInformation = useCallback(async () => {
        const loan = await getLoanInfo(loanContract, id)
        try {
            setLoanInfo(loan)
        }
        catch (err) {
            console.log(err)
        }
	}, [loanContract])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && loanContract) {
			fetchLoanInformation()
        }
        return () => { isMounted = false };
	}, [block, loanContract, securedFinance])
    
	return loanInfo
}

export const useBorrowHistory = () => {
    const { account}: { account: string } = useWallet()
    const securedFinance = useSF()
    const block = useBlock()
    const loanContract = getLoanContract(securedFinance)
    
    const borrowingHistory = useSelector((state: RootState) => state.history.borrowingHistory);
    const dispatch = useDispatch();  
    
    const fetchBorrowHistory = useCallback(async () => {
        dispatch(startSetHistory())
        const history: Promise<LoansHistory> = await getBorrowHistory(loanContract, account)
        let parsedHistory: Array<HistoryTableData> = []
        try {
            for (var i = 0; i < (await history).loans.length; i++) {
                const loanObj = Object.assign({},(await history).loans[i]) 
                parsedHistory.push(loanObj)
            }
                await dispatch(setBorrowingHistory(parsedHistory))
        }
        catch (err) {
            dispatch(failSetBorrowingHistory())
            console.log(err)
        }
	}, [dispatch, loanContract, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && loanContract && account) {
			fetchBorrowHistory()
        }
        return () => { isMounted = false };
	}, [block, loanContract, dispatch, securedFinance, account])
    
	return borrowingHistory
}