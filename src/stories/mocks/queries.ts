import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { OrderType, TransactionList } from 'src/types';
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

const generateMyTransactions = (amount: string) => {
    const myTransactions = [];
    for (let i = 0; i < 20; i++) {
        myTransactions.push({
            amount: amount,
            averagePrice: '0.8000',
            side: 1,
            orderPrice: '9543',
            createdAt: '1671080520',
            feeInFV: '3213742117859654893',
            forwardValue: '520000000000000000000',
            currency: wfilBytes32,
            maturity: mar23Fixture.toString(),
            taker: {
                id: '0x1',
            },
        });
    }
    return myTransactions;
};

const generateMyOrderHistory = (amount: string) =>
    Array(20)
        .fill(null)
        .map((_, index) => ({
            orderId: index,
            currency: wfilBytes32,
            side: 1,
            maturity: BigInt(dec22Fixture.toString()),
            inputUnitPrice: BigInt('9800'),
            filledAmount: BigInt('0'),
            inputAmount: BigInt(amount),
            status: 'Open',
            type: OrderType.LIMIT,
            createdAt: BigInt('1'),
            txHash: toBytes32('hash'),
            lendingMarket: {
                id: '1',
                isActive: true,
            },
            maker: {
                id: '0x1',
            },
        }));

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
    {
        request: {
            query: queries.UserTransactionHistoryDocument,
            variables: {
                address: '',
                skip: 0,
                first: 20,
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
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 80,
                    transactions: generateMyTransactions(
                        '500000000000000000000'
                    ),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 80,
                        transactions: generateMyTransactions(
                            '500000000000000000000'
                        ),
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
                skip: 20,
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 80,
                    transactions: generateMyTransactions(
                        '600000000000000000000'
                    ),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 80,
                        transactions: generateMyTransactions(
                            '600000000000000000000'
                        ),
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
                skip: 40,
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 80,
                    transactions: generateMyTransactions(
                        '700000000000000000000'
                    ),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 80,
                        transactions: generateMyTransactions(
                            '700000000000000000000'
                        ),
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
                skip: 60,
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    transactionCount: 80,
                    transactions: generateMyTransactions(
                        '800000000000000000000'
                    ),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        transactionCount: 80,
                        transactions: generateMyTransactions(
                            '800000000000000000000'
                        ),
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
    {
        request: {
            query: queries.UserOrderHistoryDocument,
            variables: {
                address: '',
                skip: 0,
                first: 20,
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
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orderCount: 60,
                    orders: generateMyOrderHistory('1000000000000000000000'),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orderCount: 60,
                        orders: generateMyOrderHistory(
                            '1000000000000000000000'
                        ),
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
                skip: 20,
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orderCount: 60,
                    orders: generateMyOrderHistory('2000000000000000000000'),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orderCount: 60,
                        orders: generateMyOrderHistory(
                            '2000000000000000000000'
                        ),
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
                skip: 40,
                first: 20,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    orderCount: 60,
                    orders: generateMyOrderHistory('3000000000000000000000'),
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        orderCount: 60,
                        orders: generateMyOrderHistory(
                            '3000000000000000000000'
                        ),
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
