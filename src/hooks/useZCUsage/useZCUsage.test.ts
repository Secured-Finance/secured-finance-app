import { dec22Fixture, preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useZCUsage } from './useZCUsage';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = { ...preloadedAssetPrices };

describe('useZCUsage', () => {
    it('should use filledAmount greater than 0 as estimatedLendPV', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useZCUsage('0xff'),
            { preloadedState }
        );

        await waitForNextUpdate();
        await waitForNextUpdate();
        await waitFor(() => {
            expect(
                result.current(dec22Fixture, CurrencySymbol.ETH, 10000)
            ).toBe(0);
        });
    });

    it('should use filledAmount less than 0 as estimatedBorrowPV', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useZCUsage('0xff'),
            { preloadedState }
        );

        await waitForNextUpdate();
        await waitForNextUpdate();

        expect(result.current(dec22Fixture, CurrencySymbol.ETH, -10000)).toBe(
            0
        );
    });

    it('should return 0 if denominator becomes 0', async () => {
        jest.spyOn(mock, 'getPositions').mockResolvedValueOnce([]);
        const { result, waitForNextUpdate } = renderHook(
            () => useZCUsage('0xff'),
            { preloadedState }
        );

        await waitForNextUpdate();
        await waitForNextUpdate();

        expect(result.current(dec22Fixture, CurrencySymbol.ETH, -10000)).toBe(
            0
        );
    });
});
