import { useMediaQuery } from 'react-responsive';
import { renderHook } from 'src/test-utils';
import { useBreakpoint } from './useBreakpoint';

jest.mock('react-responsive', () => ({
    useMediaQuery: jest.fn(),
}));

describe('useBreakpoint', () => {
    test('returns false when media query does not match', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useBreakpoint('md'));
        expect(result.current).toBe(false);
    });

    test('returns true when media query matches', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        const { result } = renderHook(() => useBreakpoint('tablet'));
        expect(result.current).toBe(true);
    });
});
