import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { TransactionList } from 'src/types';
import { Maturity } from 'src/utils/entities';
import {
    dailyVolumes,
    dec22Fixture,
    mar23Fixture,
    orderHistoryList,
    tradesUSDC,
    tradesWFIL,
    transactions,
    usdcBytes32,
    wfilBytes32,
} from './fixtures';

export const mockUserTransactionHistory = [
    {
        request: {
            query: queries.UserTransactionHistoryDocument,
            variables: {
                address: '',
                skip: 0,
                first: 1000,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 0,
                    transactions: [],
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 0,
                        transactions: [],
                    },
                },
            };
        },
    },
    {
        request: {
            query: queries.UserTransactionHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                skip: 0,
                first: 1000,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 5,
                    transactions: transactions,
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 5,
                        transactions: transactions,
                    },
                },
            };
        },
    },
];

export const mockUserOrderHistory = [
    {
        request: {
            query: queries.UserOrderHistoryDocument,
            variables: {
                address: '',
                skip: 0,
                first: 1000,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orderCount: 0,
                    orders: [],
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orderCount: 0,
                        orders: [],
                    },
                },
            };
        },
    },
    {
        request: {
            query: queries.UserOrderHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                skip: 0,
                first: 1000,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orderCount: 9,
                    orders: orderHistoryList,
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orderCount: 9,
                        orders: orderHistoryList,
                    },
                },
            };
        },
    },
];

export const mockDailyVolumes = [
    {
        request: {
            query: queries.DailyVolumesDocument,
            variables: {
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                dailyVolumes: dailyVolumes,
            },
        },
        newData: () => {
            return {
                data: {
                    dailyVolumes: dailyVolumes,
                },
            };
        },
    },
];

const today = 1643713200;
const yesterday = today - 24 * 3600;
const today2 = 1638356400;
const yesterday2 = today2 - 24 * 3600;

function getTransactionQuery(
    currency: string,
    maturity: Maturity,
    from: number,
    to: number,
    transactions: TransactionList,
    lastTransaction: [TransactionList[0]] | []
) {
    return {
        request: {
            query: queries.TransactionHistoryDocument,
            variables: {
                currency: currency,
                maturity: maturity.toNumber(),
                from: from,
                to: to,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactionHistory: transactions,
                lastTransaction: lastTransaction,
            },
        },
        newData: () => {
            return {
                data: {
                    transactionHistory: transactions,
                    lastTransaction: lastTransaction,
                },
            };
        },
    };
}
const MATURITY_ZERO = new Maturity(0);
export const emptyTransaction = [
    getTransactionQuery(wfilBytes32, dec22Fixture, yesterday, today, [], []),
    getTransactionQuery(wfilBytes32, dec22Fixture, yesterday2, today2, [], []),
    getTransactionQuery(wfilBytes32, MATURITY_ZERO, yesterday, today, [], []),
    getTransactionQuery(wfilBytes32, MATURITY_ZERO, yesterday2, today2, [], []),
];

function getQueryForCurrency(currency: string, transactions: TransactionList) {
    return [
        getTransactionQuery(
            currency,
            dec22Fixture,
            yesterday,
            today,
            transactions,
            [transactions[0]]
        ),
        getTransactionQuery(
            currency,
            dec22Fixture,
            yesterday2,
            today2,
            transactions,
            [transactions[0]]
        ),
        getTransactionQuery(
            currency,
            mar23Fixture,
            yesterday,
            today,
            transactions,
            [transactions[0]]
        ),
        getTransactionQuery(
            currency,
            mar23Fixture,
            yesterday2,
            today2,
            transactions,
            [transactions[0]]
        ),
        getTransactionQuery(
            currency,
            MATURITY_ZERO,
            yesterday,
            today,
            transactions,
            [transactions[0]]
        ),
        getTransactionQuery(
            currency,
            MATURITY_ZERO,
            yesterday2,
            today2,
            transactions,
            [transactions[0]]
        ),
    ];
}

export const mockTrades = [
    ...getQueryForCurrency(usdcBytes32, tradesUSDC),
    ...getQueryForCurrency(wfilBytes32, tradesWFIL),
];
