import { act, renderHook } from '@testing-library/react-hooks';
import { usePagination } from './usePagination';

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

    it('should process large amount of data', () => {
        const initialProps = Array(1000)
            .fill(null)
            .map(_ => ({
                name: 'SF',
                age: 10,
                english: 80,
                maths: 60,
                science: 95,
                history: 60,
            }));
        const { result, rerender } = renderHook(props => usePagination(props), {
            initialProps: initialProps,
        });
        expect(result.current).toEqual(initialProps);

        act(() => {
            rerender(
                Array(1000)
                    .fill(null)
                    .map(_ => ({
                        name: 'SF',
                        age: 20,
                        english: 80,
                        maths: 60,
                        science: 95,
                        history: 60,
                    }))
            );
        });

        expect(result.current).toHaveLength(2000);
        expect(result.current).toEqual([
            ...Array(1000)
                .fill(null)
                .map(_ => ({
                    name: 'SF',
                    age: 10,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
            ...Array(1000)
                .fill(null)
                .map(_ => ({
                    name: 'SF',
                    age: 20,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
        ]);

        act(() => {
            rerender(
                Array(1000)
                    .fill(null)
                    .map(_ => ({
                        name: 'SF',
                        age: 20,
                        english: 80,
                        maths: 60,
                        science: 95,
                        history: 60,
                    }))
            );
        });

        expect(result.current).toHaveLength(2000);
        expect(result.current).toEqual([
            ...Array(1000)
                .fill(null)
                .map(_ => ({
                    name: 'SF',
                    age: 10,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
            ...Array(1000)
                .fill(null)
                .map(_ => ({
                    name: 'SF',
                    age: 20,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
        ]);
    });
});
