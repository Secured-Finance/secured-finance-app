import { OrderSide } from '@secured-finance/sf-client';
import { dec22Fixture, mar23Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useZCUsage } from './useZCUsage';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useZCUsage', () => {
    it('should calculate ZC usage correctly for BORROW orders with offsetPV', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useZCUsage('0xff', OrderSide.BORROW)
        );

        await waitForNextUpdate();

        await waitFor(() => {
            expect(
                result.current(dec22Fixture, CurrencySymbol.WFIL, 1000)
            ).toBe(0);
        });
    });

    it('should calculate ZC usage correctly for BORROW orders with no offsetPV', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useZCUsage('0xff', OrderSide.BORROW)
        );

        await waitForNextUpdate();

        await waitFor(() => {
            expect(result.current(mar23Fixture, CurrencySymbol.WFIL, 3)).toBe(
                3013.63670609508
            );
        });
    });

    it('should not change ZC usage if there are no ZC bonds for the currency', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useZCUsage('0xff', OrderSide.BORROW)
        );

        await waitForNextUpdate();

        expect(result.current(dec22Fixture, CurrencySymbol.WBTC, 10000)).toBe(
            0
        );
    });

    it('should calculate correct ZC usage for LEND orders with no ZC bonds', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useZCUsage('0xff', OrderSide.LEND)
        );

        await waitForNextUpdate();

        expect(result.current(mar23Fixture, CurrencySymbol.WBTC, 0)).toBe(0);
    });
});
