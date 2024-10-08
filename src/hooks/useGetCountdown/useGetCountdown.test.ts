import { act, renderHook } from 'src/test-utils';
import { useGetCountdown } from './useGetCountdown';

describe('useGetCountdown', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return initial countdown value', () => {
        const { result } = renderHook(() =>
            useGetCountdown(Date.now() + 10000)
        );
        expect(result.current).toBeDefined();
    });

    it('should update countdown every second', () => {
        const targetTime = Date.now() + 10000;
        const { result } = renderHook(() => useGetCountdown(targetTime));

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBeDefined();
        expect(result.current?.seconds).toBe('09');
    });

    it('should return undefined for expired time', () => {
        const targetTime = Date.now() - 1000;
        const { result } = renderHook(() => useGetCountdown(targetTime));

        expect(result.current).toStrictEqual({
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
        });
    });

    it('should clear interval on unmount', () => {
        const targetTime = Date.now() + 10000;
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        const { unmount } = renderHook(() => useGetCountdown(targetTime));

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();

        clearIntervalSpy.mockRestore();
    });
});
