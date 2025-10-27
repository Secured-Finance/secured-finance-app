// Mock for Storybook - exports mutable functions that can be customized per story
export let mockUseGetQuestsQuery: any = () => ({
    data: null,
    isLoading: false,
    error: null,
});

export let mockUseGetUsersQuery: any = () => ({
    data: null,
    isLoading: false,
    error: null,
});

export let mockUseGetUserQuery: any = () => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve({ data: null }),
});

export let mockUseVerifyMutation: any = () => ({
    mutate: () => {},
    data: null,
    isPending: false,
    error: null,
});

export let mockUseNonceQuery: any = () => ({
    data: null,
    isLoading: false,
    error: null,
});

mockUseNonceQuery.fetcher = () => async () => ({ nonce: 'test-nonce' });

// Functions to update mocks
export const setMockUseGetQuestsQuery = (fn: any) => {
    mockUseGetQuestsQuery = fn;
};

export const setMockUseGetUsersQuery = (fn: any) => {
    mockUseGetUsersQuery = fn;
};

export const setMockUseGetUserQuery = (fn: any) => {
    mockUseGetUserQuery = fn;
};

export const setMockUseVerifyMutation = (fn: any) => {
    mockUseVerifyMutation = fn;
};

export const setMockUseNonceQuery = (fn: any) => {
    mockUseNonceQuery = fn;
    mockUseNonceQuery.fetcher = () => async () => ({ nonce: 'test-nonce' });
};
