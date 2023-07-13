import { renderHook, act } from '@testing-library/react-hooks';
import usePagination from './usePagination';

describe('usePagination', () => {
    it('should return the complete array when data changes', () => {
        const { result, rerender } = renderHook(props => usePagination(props), {
            initialProps: ['A', 'B'],
        });
        expect(result.current).toEqual(['A', 'B']);

        act(() => {
            rerender(['C']);
        });

        expect(result.current).toEqual(['A', 'B', 'C']);
    });

    it('should not update the array when data remains the same', () => {
        const { result, rerender } = renderHook(props => usePagination(props), {
            initialProps: ['A', 'B'],
        });
        expect(result.current).toEqual(['A', 'B']);

        act(() => {
            rerender(['A', 'B']);
        });

        expect(result.current).toEqual(['A', 'B']);
    });
});
