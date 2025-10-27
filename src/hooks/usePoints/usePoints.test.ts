import { renderHook } from 'src/test-utils';
import { usePoints } from './usePoints';

// Mock react-cookie
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [{}, jest.fn(), jest.fn()]),
}));

// Mock wagmi
jest.mock('wagmi', () => ({
    ...jest.requireActual('wagmi'),
    useAccount: jest.fn(() => ({ address: undefined })),
}));

describe('usePoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state', () => {
        const { result } = renderHook(() => usePoints());

        expect(result.current.user.data).toEqual(null);
        expect(result.current.user.loading).toEqual(false);
    });

    it('should handle loading state', () => {
        const { result } = renderHook(() => usePoints());
        expect(result.current.verification.loading).toBe(false);
    });

    it('should return verify function', () => {
        const { result } = renderHook(() => usePoints());

        expect(typeof result.current.verification.verify).toBe('function');
    });

    it('should handle user data structure correctly', () => {
        const { result } = renderHook(() => usePoints());

        // Basic structure validation
        expect(result.current.user).toBeDefined();
        expect(result.current.verification).toBeDefined();
        expect(typeof result.current.user.loading).toBe('boolean');
        expect(typeof result.current.verification.loading).toBe('boolean');
        expect(typeof result.current.verification.verify).toBe('function');
    });
});
