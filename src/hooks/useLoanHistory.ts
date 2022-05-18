import {
    useBorrowingDeals,
    useLendingDeals,
    useLoanInfo,
} from '@secured-finance/sf-graph-client';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HistoryTableData } from 'src/store/history/types';
import { useWallet } from 'use-wallet';
import { setBorrowingHistory, setLendingHistory } from '../store/history';
import { RootState } from '../store/types';

export const useLoanDeals = (skip = 0) => {
    const { account } = useWallet();
    const lendingHistory = useSelector(
        (state: RootState) => state.history.lendingHistory
    );
    const dispatch = useDispatch();

    try {
        const res = useLendingDeals(account ? account : '', skip);
        if (res.length > 0) {
            dispatch(setLendingHistory(res));
        }
    } catch (err) {
        console.log(err);
    }

    return lendingHistory;
};

export const useBorrowDeals = (skip = 0) => {
    const { account } = useWallet();
    const borrowingHistory = useSelector(
        (state: RootState) => state.history.borrowingHistory
    );
    const dispatch = useDispatch();

    try {
        const res = useBorrowingDeals(account, skip) as HistoryTableData[];
        if (res.length > 0) {
            dispatch(setBorrowingHistory(res));
        }
    } catch (err) {
        console.log(err);
    }

    return borrowingHistory;
};

export const useLoanInformation = (id: string) => {
    const [loanInfo, setLoanInfo] = useState(null);
    const loan = useLoanInfo(id);

    useMemo(() => {
        if (loan) {
            setLoanInfo(loan);
        }
    }, [loan]);

    return loanInfo;
};
