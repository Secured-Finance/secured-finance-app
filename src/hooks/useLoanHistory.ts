import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';

import { getLoanContract, getLoanInfo } from '../services/sdk/utils';
import useSF from './useSecuredFinance';
import useBlock from './useBlock';
import { emptyLoan, HistoryTableData, Schedule } from '../store/history/types';
import { RootState } from '../store/types';
import {
    failSetBorrowingHistory,
    failSetLendingHistory,
    setBorrowingHistory,
    setLendingHistory,
    startSetHistory,
} from '../store/history';
import {
    client,
    BORROW_DEALS,
    LOAN_DEALS,
    LOAN_INFO,
} from '../services/apollo';

interface LoansHistory {
    isValue: boolean;
    loans: HistoryTableData[];
}

export const useLoanState = (id: any) => {
    const [loanInfo, setLoanInfo] = useState(emptyLoan);
    const securedFinance = useSF();
    const block = useBlock();
    const loanContract = getLoanContract(securedFinance);

    const fetchLoanInformation = useCallback(async () => {
        const loan = await getLoanInfo(loanContract, id);
        try {
            setLoanInfo(loan);
        } catch (err) {
            console.log(err);
        }
    }, [loanContract]);

    useEffect(() => {
        let isMounted = true;
        if (securedFinance && loanContract) {
            fetchLoanInformation();
        }
        return () => {
            isMounted = false;
        };
    }, [block, loanContract, securedFinance]);

    return loanInfo;
};

export const useLoanDeals = () => {
    const { account } = useWallet();
    const lendingHistory = useSelector(
        (state: RootState) => state.history.lendingHistory
    );
    const dispatch = useDispatch();

    const fetchLoanHistory = useCallback(async () => {
        dispatch(startSetHistory());
        try {
            let res = await client.query({
                query: LOAN_DEALS,
                variables: {
                    account: account.toLowerCase(),
                },
                fetchPolicy: 'cache-first',
            });
            if (res?.data.loans) {
                await dispatch(setLendingHistory(res.data.loans));
            }
        } catch (err) {
            dispatch(failSetLendingHistory());
            console.log(err);
        }
    }, [dispatch, account]);

    useEffect(() => {
        let isMounted = true;
        if (account) {
            fetchLoanHistory();
        }
        return () => {
            isMounted = false;
        };
    }, [account, dispatch]);

    return lendingHistory;
};

export const useBorrowDeals = () => {
    const { account } = useWallet();
    const borrowingHistory = useSelector(
        (state: RootState) => state.history.borrowingHistory
    );
    const dispatch = useDispatch();

    const fetchLoanHistory = useCallback(async () => {
        dispatch(startSetHistory());
        try {
            let res = await client.query({
                query: BORROW_DEALS,
                variables: {
                    account: account,
                },
                fetchPolicy: 'cache-first',
            });
            if (res?.data.loans) {
                console.log(res.data.loans);
                await dispatch(setBorrowingHistory(res.data.loans));
            }
        } catch (err) {
            dispatch(failSetBorrowingHistory());
            console.log(err);
        }
    }, [dispatch, account]);

    useEffect(() => {
        let isMounted = true;
        if (account) {
            fetchLoanHistory();
        }
        return () => {
            isMounted = false;
        };
    }, [account, dispatch]);

    return borrowingHistory;
};

export const useLoanInformation = (id: string) => {
    const [loanInfo, setLoanInfo] = useState(null);

    const fetchLoanInformation = useCallback(async () => {
        let res = await client.query({
            query: LOAN_INFO,
            variables: {
                id: id,
            },
            fetchPolicy: 'cache-first',
        });

        try {
            if (res?.data.loan) {
                setLoanInfo(res.data.loan);
            }
        } catch (err) {
            console.log(err);
        }
    }, [id]);

    useEffect(() => {
        let isMounted = true;
        if (id != null) {
            fetchLoanInformation();
        }
        return () => {
            isMounted = false;
        };
    }, [id]);

    return loanInfo;
};
