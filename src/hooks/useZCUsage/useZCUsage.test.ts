import { OrderSide } from '@secured-finance/sf-client';
import {
    dec22Fixture,
    ethBytes32,
    jun23Fixture,
    mar23Fixture,
    usdcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useZCUsage } from './useZCUsage';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const mockPositions = [
    {
        ccy: ethBytes32,
        maturity: dec22Fixture.toString(),
        presentValue: BigInt('9954750000000000000'),
        futureValue: BigInt('10210000000000000000'),
    },
    {
        ccy: ethBytes32,
        maturity: jun23Fixture.toString(),
        presentValue: BigInt('9954750000000000000'),
        futureValue: BigInt('10210000000000000000'),
    },
    {
        ccy: ethBytes32,
        maturity: mar23Fixture.toString(),
        presentValue: BigInt('-10558255657026800000'),
        futureValue: BigInt('-11113953323186200000'),
    },
    {
        ccy: wfilBytes32,
        maturity: dec22Fixture.toString(),
        presentValue: BigInt('9954750000000000000'),
        futureValue: BigInt('10210000000000000000'),
    },
    {
        ccy: usdcBytes32,
        maturity: mar23Fixture.toString(),
        presentValue: BigInt('-63000000'),
        futureValue: BigInt('-67000000'),
    },
];

describe('useZCUsage', () => {
    describe('Borrow orders', () => {
        it('user has no orders', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(dec22Fixture, CurrencySymbol.ETH, 1000),
                ).toBe(0);
            });
        });

        it('user only has borrow orders and no offset order', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(dec22Fixture, CurrencySymbol.USDC, 1000),
                ).toBe(0);
            });
        });

        it('user only has borrow orders and offset order', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(mar23Fixture, CurrencySymbol.USDC, 1000),
                ).toBe(0);
            });
        });

        it('user only has lend orders and no offset order', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(mar23Fixture, CurrencySymbol.WFIL, 5),
                ).toBe(5022.7278434918);
            });
        });

        it('user only has lend orders and offset order', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(dec22Fixture, CurrencySymbol.WFIL, 1),
                ).toBe(0);
            });
        });

        it('user has lend and borrow positions with offset order', async () => {
            jest.spyOn(mock, 'getPositions').mockResolvedValueOnce(
                mockPositions,
            );
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() =>
                expect(
                    result.current(mar23Fixture, CurrencySymbol.ETH, 5),
                ).toBe(7814.488388471232),
            );
        });

        it('user only has lend orders and offset order with value greater than ZC bond', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(dec22Fixture, CurrencySymbol.WFIL, 9),
                ).toBe(0);
            });
        });

        it('Maximum ZC usage should be 8000', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.BORROW),
            );

            await waitFor(() => {
                expect(
                    result.current(dec22Fixture, CurrencySymbol.ETH, 6),
                ).toBe(8000);
            });
        });
    });

    describe('Lend orders', () => {
        it('should not change ZC usage for lend orders if there are no positions', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.LEND),
            );

            await waitFor(() =>
                expect(
                    result.current(mar23Fixture, CurrencySymbol.WBTC, 10000),
                ).toBe(0),
            );
        });

        it('should not change ZC usage for lend orders if there are no borrow positions and only lend positions', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.LEND),
            );

            await waitFor(() =>
                expect(
                    result.current(mar23Fixture, CurrencySymbol.WFIL, 10000),
                ).toBe(0),
            );
        });

        it('should show correct ZC usage for borrow positions', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.LEND),
            );

            await waitFor(() =>
                expect(
                    result.current(jun23Fixture, CurrencySymbol.USDC, 100),
                ).toBe(6300),
            );
        });

        it('should show correct ZC usage for borrow offset positions', async () => {
            const { result } = renderHook(() =>
                useZCUsage('0xff', OrderSide.LEND),
            );

            await waitFor(() =>
                expect(
                    result.current(mar23Fixture, CurrencySymbol.ETH, 5),
                ).toBe(5583.521089958864),
            );
        });
    });
});
