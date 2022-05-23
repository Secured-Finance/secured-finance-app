import {
    useBorrowingDeals,
    useLendingDeals,
    useLoanInfo,
} from '@secured-finance/sf-graph-client';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { useWallet } from 'use-wallet';
import { setBorrowingHistory, setLendingHistory } from '../store/history';

export const useLoanDeals = (skip = 0) => {
    const { account } = useWallet();
    const lendingHistory = useSelector(
        (state: RootState) => state.history.lendingHistory
    );
    const dispatch = useDispatch();
    const { data, error } = useLendingDeals(account ? account : '', skip);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            dispatch(setLendingHistory(data));
        }
    }, [dispatch, data]);

    return lendingHistory;
};

export const useBorrowDeals = (skip = 0) => {
    const { account } = useWallet();
    const borrowingHistory = useSelector(
        (state: RootState) => state.history.borrowingHistory
    );
    const dispatch = useDispatch();
    const { data, error } = useBorrowingDeals(account ? account : '', skip);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            dispatch(setBorrowingHistory(data));
        }
    }, [dispatch, data]);

    return borrowingHistory;
};

export const useLoanInformation = (id: string) => {
    const [loanInfo, setLoanInfo] = useState(null);
    const { data, error } = useLoanInfo(id);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            setLoanInfo(data);
        }
    }, [data]);

    return loanInfo;
};
