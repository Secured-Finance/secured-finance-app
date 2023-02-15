import {
    OrderHistoryDocument,
    TransactionHistoryDocument,
} from '@secured-finance/sf-graph-client/dist/graphclient';
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
                address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
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
                address: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
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
