import {
    DailyVolumesDocument,
    TradesDocument,
    UserHistoryDocument,
} from '@secured-finance/sf-graph-client/dist/graphclient/.graphclient';
import {
    btcBytes32,
    dailyVolumes,
    dec22Fixture,
    ethBytes32,
    filBytes32,
    orderHistoryList,
    trades,
    transactions,
    usdcBytes32,
} from './fixtures';

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

export const mockDailyVolumes = [
    {
        request: {
            query: DailyVolumesDocument,
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

const today = 1638356400;
const yesterday = 1638270000;
export const mockTrades = [
    {
        request: {
            query: TradesDocument,
            variables: {
                currency: filBytes32,
                maturity: dec22Fixture.toNumber(),
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
            query: TradesDocument,
            variables: {
                currency: filBytes32,
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
            query: TradesDocument,
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
            query: TradesDocument,
            variables: {
                currency: btcBytes32,
                maturity: dec22Fixture.toNumber(),
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
            query: TradesDocument,
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
