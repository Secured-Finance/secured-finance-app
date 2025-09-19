// GraphQL mock type definition for backward compatibility
// Note: Tests now use jest.mock for generated hooks instead of this system

interface GraphQLRequest {
    query: string;
    variables?: Record<string, unknown>;
}

export interface GraphQLMock {
    request: GraphQLRequest;
    result?: {
        data?: unknown;
        errors?: Array<{
            message: string;
            locations?: unknown;
            path?: unknown;
        }>;
    };
    error?: Error;
    delay?: number;
    newData?: () => { data?: unknown; errors?: unknown };
}

// No-op functions for backward compatibility
export const setupGraphQLMocks = (_mocks: GraphQLMock[]) => {
    // No longer needed - tests use jest.mock
};

export const cleanupGraphQLMocks = () => {
    // No longer needed - tests use jest.mock
};
