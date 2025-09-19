import { renderHook } from 'src/test-utils';
import { usePoints } from './usePoints';

// SKIPPED: Points client tests temporarily disabled
describe.skip('usePoints', () => {
    it('should return initial state', () => {
        const { result } = renderHook(() => usePoints());

        expect(result.current.user.data).toEqual(undefined);
        expect(result.current.user.loading).toEqual(false);
    });

    it('should handle loading state', () => {
        const { result } = renderHook(() => usePoints());
        expect(result.current.verification.loading).toBe(false);
    });

    it('should return verify function', () => {
        const { result } = renderHook(() => usePoints());

        expect(result.current.verification.verify).toBeInstanceOf(Function);
    });
});
