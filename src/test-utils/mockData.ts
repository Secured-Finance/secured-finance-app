// Simplified GraphQL mocks for test-utils compatibility
// Note: Most tests now use jest.mock for generated hooks directly

import type { GraphQLMock } from './graphqlMocks';

// Minimal GraphQL mock for backward compatibility
// Note: Tests now primarily use jest.mock for generated hooks

// Empty arrays for backward compatibility with existing tests
export const mockRecentTradesTable: GraphQLMock[] = [];
export const mockRecentTradesTableEmpty: GraphQLMock[] = [];
export const mockUserCountAndVolume: GraphQLMock[] = [];
export const mockDailyVolumes: GraphQLMock[] = [];
export const mockTransactionCandleStick: GraphQLMock[] = [];
export const mockUserTransactionHistory: GraphQLMock[] = [];

// Simplified unified mocks object for backward compatibility
export const graphqlMocks = {
    withTransactions: [],
    empty: [],
    userCountAndVolume: [],
    dailyVolumes: [],
    recentTrades: [],
    userTransactionHistory: [],
    transactionCandleStick: [],
};

// Default export for convenience
export default graphqlMocks;
