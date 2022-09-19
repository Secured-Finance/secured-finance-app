import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { RateType, useRates } from './useRates';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useRates', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.Borrow)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(typeof rate).toBe('number')
        );
    });

    it('should return an array of number for lend rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.Lend)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(typeof rate).toBe('number')
        );
    });

    it('should return an array of number for mid rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useRates(CurrencySymbol.ETH, RateType.MidRate)
        );
        expect(result.current).toEqual([]);

        await waitForNextUpdate();
        result.current.forEach((rate: unknown) =>
            expect(typeof rate).toBe('number')
        );
    });
});
