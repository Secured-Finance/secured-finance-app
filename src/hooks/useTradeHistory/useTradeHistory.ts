import {
    useBuyerTransactionHistory,
    useSellerTransactionHistory,
} from '@secured-finance/sf-graph-client';
import {
    BuyerTransactionsQuery,
    SellerTransactionsQuery,
} from '@secured-finance/sf-graph-client/dist/graphclients';

export type TradeHistory =
    | SellerTransactionsQuery['transactions']
    | BuyerTransactionsQuery['transactions'];

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
        ...(lendingHistory?.transactions ?? []),
        ...(borrowingHistory?.transactions ?? []),
    ];
};
