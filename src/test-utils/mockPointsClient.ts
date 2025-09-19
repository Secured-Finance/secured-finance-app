// Mock for @secured-finance/sf-point-client hooks
// This eliminates the need for Apollo Client in tests

export const mockUseGetUserLazyQuery = jest.fn(() => [
    jest.fn(), // getUser function
    {
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
    },
]);

export const mockUseVerifyMutation = jest.fn(() => [
    jest.fn(), // verify function
    {
        data: null,
        loading: false,
        error: null,
    },
]);

// Mock the entire sf-point-client module
jest.mock('@secured-finance/sf-point-client', () => ({
    useGetUserLazyQuery: mockUseGetUserLazyQuery,
    useVerifyMutation: mockUseVerifyMutation,
    GetUserDocument: {}, // Mock document
}));
