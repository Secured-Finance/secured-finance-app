import {
    useBuyerTransactionHistory,
    useSellerTransactionHistory,
} from '@secured-finance/sf-graph-client';
import {
    BuyerTransactionsQuery,
    SellerTransactionsQuery,
} from '@secured-finance/sf-graph-client/dist/graphclients';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

export type TradeHistory =
    | SellerTransactionsQuery['transactions']
    | BuyerTransactionsQuery['transactions'];

export const useTradeHistory = (account: string | null) => {
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const {
        data: lendingHistory,
        error: lendingError,
        refetch: refetchSeller,
    } = useSellerTransactionHistory({
        account: account ?? '',
    });

    const {
        data: borrowingHistory,
        error: borrowingError,
        refetch: refetchBuyer,
    } = useBuyerTransactionHistory({
        account: account ?? '',
    });

    if (lendingError) {
        console.error(lendingError);
    }

    if (borrowingError) {
        console.error(borrowingError);
    }

    useEffect(() => {
        refetchSeller?.();
        refetchBuyer?.();
    }, [block, refetchSeller, refetchBuyer]);

    return [
        ...(lendingHistory?.transactions ?? []),
        ...(borrowingHistory?.transactions ?? []),
    ];
};
