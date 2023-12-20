import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, ZERO_BI, toCurrency } from 'src/utils';
import { useOrderEstimation } from './useOrderEstimation';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderEstimation.mockClear());

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        side: OrderSide.BORROW,
        maturity: dec22Fixture.toNumber(),
        amount: '5',
        unitPrice: '98',
        isBorrowedCollateral: false,
        sourceAccount: WalletSource.METAMASK,
    },
};

describe('useOrderEstimation', () => {
    it('should be called with falsy ignoreBorrowedAmount if isBorrowedCollateral is false in borrow orders', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            { preloadedState }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.BORROW,
            BigInt('5000000'),
            9800,
            ZERO_BI,
            false
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called with truthy ignoreBorrowedAmount if isBorrowedCollateral is true', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        isBorrowedCollateral: true,
                    },
                },
            }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.BORROW,
            BigInt('5000000'),
            9800,
            ZERO_BI,
            true
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called without ignoreBorrowedAmount in lend orders', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        isBorrowedCollateral: true,
                        side: OrderSide.LEND,
                        sourceAccount: WalletSource.SF_VAULT,
                    },
                },
            }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.LEND,
            BigInt('5000000'),
            9800,
            ZERO_BI,
            false
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called with additionalDepositAmount in LEND orders if wallet source is not SF Vault', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        side: OrderSide.LEND,
                    },
                },
            }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.LEND,
            BigInt('5000000'),
            9800,
            BigInt('5000000'),
            false
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called with 0 additionalDepositAmount in LEND orders if wallet source is SF Vault', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        sourceAccount: WalletSource.SF_VAULT,
                        side: OrderSide.LEND,
                    },
                },
            }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.LEND,
            BigInt('5000000'),
            9800,
            ZERO_BI,
            false
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called with 0 additionalDepositAmount in Borrow orders', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            { preloadedState }
        );

        await waitForNextUpdate();

        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            '0x0',
            OrderSide.BORROW,
            BigInt('5000000'),
            9800,
            ZERO_BI,
            false
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });
});
