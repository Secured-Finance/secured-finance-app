import { useTransactionHistory } from '@secured-finance/sf-graph-client';
import { TransactionHistoryQuery } from '@secured-finance/sf-graph-client/dist/graphclients';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

export type TradeHistory = TransactionHistoryQuery['transactions'];

export const useTradeHistory = (account: string | null): TradeHistory | [] => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const {
        data: transactionHistory,
        error: error,
        refetch: refetchSeller,
    } = useTransactionHistory({
        account: account ?? '',
    });

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        refetchSeller?.();
    }, [block, refetchSeller]);

    return transactionHistory?.transactions ?? [];
};
