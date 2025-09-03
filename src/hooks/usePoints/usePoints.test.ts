import { renderHook } from 'src/test-utils';
import { usePoints } from './usePoints';
import {
    useGetUserLazyQuery,
    useVerifyMutation,
} from '@secured-finance/sf-point-client';

jest.mock('src/stories/mocks/mockWallet', () => {
    const original = jest.requireActual('src/stories/mocks/mockWallet');
    return {
        ...original,
        publicClient: {},
        connector: original.connector,
    };
});

jest.mock('@secured-finance/sf-point-client', () => ({
    useGetUserLazyQuery: jest.fn(),
    useVerifyMutation: jest.fn(),
}));

describe('usePoints', () => {
    beforeEach(() => {
        const mockedGetUser = useGetUserLazyQuery as jest.Mock;
        const mockedVerify = useVerifyMutation as jest.Mock;

        mockedGetUser.mockReturnValue([
            jest.fn(),
            { data: undefined, loading: false, refetch: jest.fn() },
        ]);

        mockedVerify.mockReturnValue([
            jest.fn(),
            { data: undefined, loading: false, error: null },
        ]);
    });

    it('should return initial state', () => {
        const { result } = renderHook(() => usePoints());
        expect(result.current.user.data).toBeUndefined();
        expect(result.current.user.loading).toBe(false);
    });

    it('should handle loading state', () => {
        const { result } = renderHook(() => usePoints());
        expect(result.current.verification.loading).toBe(false);
    });

    it('should return verify function', () => {
        const { result } = renderHook(() => usePoints());
        expect(typeof result.current.verification.verify).toBe('function');
    });
});
