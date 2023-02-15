import { UserHistoryDocument } from '@secured-finance/sf-graph-client/dist/graphclient/.graphclient';
import { orderHistoryList, transactions } from './fixtures';

export const mockUserHistory = [
    {
        request: {
            query: UserHistoryDocument,
            variables: {
                address: '',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orders: [],
                    transactions: [],
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orders: [],
                        transactions: [],
                    },
                },
            };
        },
    },
    {
        request: {
            query: UserHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orders: orderHistoryList,
                    transactions: transactions,
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orders: orderHistoryList,
                        transactions: transactions,
                    },
                },
            };
        },
    },
];
