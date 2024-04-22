import { act, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
    it('should return an empty array when current and data user do not match', () => {
        const { result } = renderHook(
            props => usePagination(props, '0x', '0x1'),
            {
                initialProps: [{ id: 1 }, { id: 2 }],
            }
        );
        expect(result.current).toEqual([]);
    });

    it('should return the complete array when data changes', () => {
        const { result, rerender } = renderHook(
            props => usePagination(props, '0x1', '0x1'),
            {
                initialProps: [{ id: 1 }, { id: 2 }],
            }
        );
        expect(result.current).toEqual([{ id: 1 }, { id: 2 }]);

        act(() => {
            rerender([{ id: 3 }]);
        });

        expect(result.current).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('should not update the array when data remains the same', () => {
        const { result, rerender } = renderHook(
            props => usePagination(props, '0x1', '0x1'),
            {
                initialProps: [{ id: 1 }, { id: 2 }],
            }
        );
        expect(result.current).toEqual([{ id: 1 }, { id: 2 }]);

        act(() => {
            rerender([{ id: 1 }, { id: 2 }]);
        });

        expect(result.current).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should process large amount of data', () => {
        const initialProps = Array(1000)
            .fill(null)
            .map((_, index) => ({
                id: index,
                name: 'AB',
                age: 10,
                english: 80,
                maths: 60,
                science: 95,
                history: 60,
            }));
        const { result, rerender } = renderHook(
            props => usePagination(props, '0x1', '0x1'),
            {
                initialProps: initialProps,
            }
        );
        expect(result.current).toEqual(initialProps);

        act(() => {
            rerender(
                Array(1000)
                    .fill(null)
                    .map((_, index) => ({
                        id: index + 1000,
                        name: 'CD',
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
                .map((_, index) => ({
                    id: index,
                    name: 'AB',
                    age: 10,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
            ...Array(1000)
                .fill(null)
                .map((_, index) => ({
                    id: index + 1000,
                    name: 'CD',
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
                    .map((_, index) => ({
                        id: index + 1000,
                        name: 'EF',
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
                .map((_, index) => ({
                    id: index,
                    name: 'AB',
                    age: 10,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
            ...Array(1000)
                .fill(null)
                .map((_, index) => ({
                    id: index + 1000,
                    name: 'EF',
                    age: 20,
                    english: 80,
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
        ]);
    });
});
