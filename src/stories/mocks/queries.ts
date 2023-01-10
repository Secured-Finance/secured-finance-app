import {
    OrderHistoryDocument,
    TransactionHistoryDocument,
} from '@secured-finance/sf-graph-client/dist/graphclients';
import { orderHistoryList, transactions } from './fixtures';

export const mockTransactionHistory = [
    {
        request: {
            query: TransactionHistoryDocument,
            variables: {
                address: '',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: [],
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: [],
                },
            };
        },
    },
    {
        request: {
            query: TransactionHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: transactions,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: transactions,
                },
            };
        },
    },
];

export const mockOrderHistory = [
    {
        request: {
            query: OrderHistoryDocument,
            variables: {
                address: '',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                orders: [],
            },
        },
        newData: () => {
            return {
                data: {
                    orders: [],
                },
            };
        },
    },
    {
        request: {
            query: OrderHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                orders: orderHistoryList,
            },
        },
        newData: () => {
            return {
                data: {
                    orders: orderHistoryList,
                },
            };
        },
    },
];
