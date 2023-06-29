import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { TransactionList } from 'src/types';
import { Maturity } from 'src/utils/entities';
import {
    dailyVolumes,
    dec22Fixture,
    efilBytes32,
    mar23Fixture,
    orderHistoryList,
    tradesEFIL,
    tradesUSDC,
    transactions,
    usdcBytes32,
} from './fixtures';

export const mockUserHistory = [
    {
        request: {
            query: queries.UserHistoryDocument,
            variables: {
                address: '',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    id: '',
                    orders: [],
                    transactions: [],
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        id: '',
                        orders: [],
                        transactions: [],
                    },
                },
            };
        },
    },
    {
        request: {
            query: queries.UserHistoryDocument,
            variables: {
                address: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                user: {
                    id: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                    orders: orderHistoryList,
                    transactions: transactions,
                },
            },
        },
        newData: () => {
            return {
                data: {
                    user: {
                        id: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
                        orders: orderHistoryList,
                        transactions: transactions,
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
    getTransactionQuery(efilBytes32, dec22Fixture, yesterday, today, [], []),
    getTransactionQuery(efilBytes32, dec22Fixture, yesterday2, today2, [], []),
    getTransactionQuery(efilBytes32, MATURITY_ZERO, yesterday, today, [], []),
    getTransactionQuery(efilBytes32, MATURITY_ZERO, yesterday2, today2, [], []),
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
    ...getQueryForCurrency(efilBytes32, tradesEFIL),
];
