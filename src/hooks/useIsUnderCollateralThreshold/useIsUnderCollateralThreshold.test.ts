import { OrderSide } from '@secured-finance/sf-client';
import { dec24Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useIsUnderCollateralThreshold } from './useIsUnderCollateralThreshold';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useIsUnderCollateralThreshold', () => {
    describe('Edge cases', () => {
        it('should return false if the user is not connected', () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    undefined,
                    CurrencySymbol.USDC,
                    1,
                    100,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
        });

        it('returns false if market is not defined', () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    1,
                    100,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
        });
    });

    describe('Lend Position', () => {
        it('return false if the price is higher than currentMinDebtUnitPrice and the position is lend', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9800,
                    OrderSide.LEND
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(false);
        });

        it('return false if the price is lower than currentMinDebtUnitPrice and the position is lend', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9200,
                    OrderSide.LEND
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(false);
        });
    });

    describe('Pre-Order markets', () => {
        it('returns false if the price is above the threshold', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9800,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(false);
        });

        it('returns true if the price is above the threshold', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9200,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(true);
        });
    });

    describe('Lend Position', () => {
        it('return false if the price is higher than currentMinDebtUnitPrice in a currency where the user has an active lend position', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9800,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(false);
        });

        it('return false if the price is lower than currentMinDebtUnitPrice in a currency where the user has an active lend position', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.USDC,
                    dec24Fixture.toNumber(),
                    9200,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(true);
        });

        it('return false if the price is higher than currentMinDebtUnitPrice in a currency where the user does not have an active lend position', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.WFIL,
                    dec24Fixture.toNumber(),
                    9800,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(false);
        });

        it('return false if the price is lower than currentMinDebtUnitPrice in a currency where the user does not have an active lend position', async () => {
            const { result, waitForNextUpdate } = renderHook(() =>
                useIsUnderCollateralThreshold(
                    '0xff',
                    CurrencySymbol.WFIL,
                    dec24Fixture.toNumber(),
                    9200,
                    OrderSide.BORROW
                )
            );
            expect(result.current).toBe(false);
            await waitForNextUpdate();
            expect(result.current).toBe(true);
        });
    });
});
