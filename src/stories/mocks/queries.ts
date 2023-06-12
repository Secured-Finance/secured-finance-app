import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import {
    dailyVolumes,
    dec22Fixture,
    mar23Fixture,
    efilBytes32,
    ethBytes32,
    orderHistoryList,
    tradesEFIL,
    tradesETH,
    tradesUSDC,
    tradesWBTC,
    transactions,
    usdcBytes32,
    wbtcBytes32,
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
            query: queries.UserHistoryDocument,
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

export const mockTrades = [
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: efilBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesEFIL,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesEFIL,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: efilBytes32,
                maturity: 0,
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                tradesEFIL,
            },
        },
        newData: () => {
            return {
                data: {
                    tradesEFIL,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: ethBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesETH,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesETH,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: wbtcBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesWBTC,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesWBTC,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: usdcBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesUSDC,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesUSDC,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: efilBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday2,
                to: today2,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesEFIL,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesEFIL,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: efilBytes32,
                maturity: 0,
                from: yesterday2,
                to: today2,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                tradesEFIL,
            },
        },
        newData: () => {
            return {
                data: {
                    tradesEFIL,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: ethBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday2,
                to: today2,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesETH,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesETH,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: wbtcBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday2,
                to: today2,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesWBTC,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesWBTC,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: usdcBytes32,
                maturity: dec22Fixture.toNumber(),
                from: yesterday2,
                to: today2,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                transactions: tradesUSDC,
            },
        },
        newData: () => {
            return {
                data: {
                    transactions: tradesUSDC,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: efilBytes32,
                maturity: mar23Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                trades,
            },
        },
        newData: () => {
            return {
                data: {
                    trades,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: usdcBytes32,
                maturity: 0,
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                trades,
            },
        },
        newData: () => {
            return {
                data: {
                    trades,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: ethBytes32,
                maturity: mar23Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                trades,
            },
        },
        newData: () => {
            return {
                data: {
                    trades,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: wbtcBytes32,
                maturity: mar23Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                trades,
            },
        },
        newData: () => {
            return {
                data: {
                    trades,
                },
            };
        },
    },
    {
        request: {
            query: queries.TradesDocument,
            variables: {
                currency: usdcBytes32,
                maturity: mar23Fixture.toNumber(),
                from: yesterday,
                to: today,
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                trades,
            },
        },
        newData: () => {
            return {
                data: {
                    trades,
                },
            };
        },
    },
];
