// Mock for generated points client hooks
// This provides test mocks for the real points API integration

export const mockUseGetUserQuery = jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
}));

export const mockUseVerifyMutation = jest.fn(() => ({
    mutate: jest.fn(),
    data: null,
    isPending: false,
    error: null,
}));

export const mockUseNonceQuery = jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
}));

// @ts-expect-error - Adding fetcher property to mock function for test compatibility
mockUseNonceQuery.fetcher = jest.fn(() => jest.fn());

export const mockUseGetQuestsQuery = jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
}));

export const mockUseGetUsersQuery = jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
}));
