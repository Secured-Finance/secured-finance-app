import { OrderSide } from '@secured-finance/sf-client';
import { dec22Fixture, dec24Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import {
    useIsUnderCollateralThreshold,
    useIsUnderCollateralThresholdForBorrowOrders,
} from './useIsUnderCollateralThreshold';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useIsUnderCollateralThreshold', () => {
    describe('Edge cases', () => {
        it('should return false if the user is not connected', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold(undefined)
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        1,
                        100,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });

        it('returns false if market is not defined', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        1,
                        100,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });
    });

    describe('When OrderSide is Lend', () => {
        it('should always return false whatever the price', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec24Fixture.toNumber(),
                        9800,
                        OrderSide.LEND
                    )
                ).toBe(false)
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec24Fixture.toNumber(),
                        9200,
                        OrderSide.LEND
                    )
                ).toBe(false)
            );
        });
    });

    describe('Pre-Order markets', () => {
        it('returns false if the price is above the threshold', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec24Fixture.toNumber(),
                        9800,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });

        it('returns true if the price is above the threshold', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec24Fixture.toNumber(),
                        9200,
                        OrderSide.BORROW
                    )
                ).toBe(true)
            );
        });
    });

    describe('when user has an active lend position', () => {
        it('returns false when price is higher than currentMinDebtUnitPrice', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.WFIL,
                        dec22Fixture.toNumber(),
                        9800,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });

        it('returns false when price is lower than currentMinDebtUnitPrice', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.WFIL,
                        dec22Fixture.toNumber(),
                        9200,
                        OrderSide.BORROW
                    )
                ).toBe(true)
            );
        });
    });

    describe('when user does not have an active lend position', () => {
        it('returns false when price is higher than currentMinDebtUnitPrice', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec22Fixture.toNumber(),
                        9800,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });

        it('returns false when price is lower than currentMinDebtUnitPrice', async () => {
            const { result } = renderHook(() =>
                useIsUnderCollateralThreshold('0xff')
            );

            await waitFor(() =>
                expect(
                    result.current(
                        CurrencySymbol.USDC,
                        dec22Fixture.toNumber(),
                        9200,
                        OrderSide.BORROW
                    )
                ).toBe(false)
            );
        });
    });
});

describe('useIsUnderCollateralThresholdForBorrowOrders', () => {
    // 9500 is the currentMinDebtUnitPrice for ETH in the mock, availableToBorrow is 2.6 ETH
    it('returns true when price is less than currentMinDebtUnitPrice and required collateral is more than available to borrow', async () => {
        const { result } = renderHook(() =>
            useIsUnderCollateralThresholdForBorrowOrders(
                '0xff',
                CurrencySymbol.ETH
            )
        );

        await waitFor(() =>
            expect(
                result.current(
                    CurrencySymbol.ETH,
                    dec22Fixture.toNumber(),
                    8500,
                    OrderSide.BORROW,
                    BigInt(2400000000000000000)
                )
            ).toBe(true)
        );
    });

    it('returns false when price is less than currentMinDebtUnitPrice and required collateral is less than available to borrow', async () => {
        const { result } = renderHook(() =>
            useIsUnderCollateralThresholdForBorrowOrders(
                '0xff',
                CurrencySymbol.ETH
            )
        );

        await waitFor(() =>
            expect(
                result.current(
                    CurrencySymbol.ETH,
                    dec22Fixture.toNumber(),
                    9000,
                    OrderSide.BORROW,
                    BigInt(2400000000000000000)
                )
            ).toBe(false)
        );
    });
});
