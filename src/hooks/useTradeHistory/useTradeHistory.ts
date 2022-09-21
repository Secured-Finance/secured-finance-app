import {
    useBuyerTransactionHistory,
    useSellerTransactionHistory,
} from '@secured-finance/sf-graph-client';
import {
    BuyerTransactionTableQuery,
    SellerTransactionTableQuery,
} from '@secured-finance/sf-graph-client/dist/graphclients';

export type TradeHistory =
    | SellerTransactionTableQuery['transactionTables']
    | BuyerTransactionTableQuery['transactionTables'];

export const useTradeHistory = (account: string | null) => {
    const { data: lendingHistory, error: lendingError } =
        useSellerTransactionHistory({
            account: account ?? '',
        });

    const { data: borrowingHistory, error: borrowingError } =
        useBuyerTransactionHistory({
            account: account ?? '',
        });

    if (lendingError) {
        console.error(lendingError);
    }

    if (borrowingError) {
        console.error(borrowingError);
    }

    return [
        ...(lendingHistory?.transactionTables ?? []),
        ...(borrowingHistory?.transactionTables ?? []),
    ];
};
