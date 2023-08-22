import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, renderHook } from 'src/test-utils';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { useOrderEstimation } from './useOrderEstimation';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        side: OrderSide.BORROW,
        maturity: dec22Fixture.toNumber(),
        amount: BigNumber.from('5000000'),
        unitPrice: 9800,
        isBorrowedCollateral: false,
        sourceAccount: WalletSource.METAMASK,
    },
};

describe('useOrderEstimation', () => {
    it('should be called without additionalDepositAmount if isBorrowedCollateral is false', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useOrderEstimation('0x0'),
            { preloadedState }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            OrderSide.BORROW,
            BigNumber.from('5000000'),
            9800,
            0,
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
        await act(async () => {
            await waitForNextUpdate();
        });
        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            OrderSide.BORROW,
            BigNumber.from('5000000'),
            9800,
            0,
            true
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
                        sourceAccount: WalletSource.METAMASK,
                        side: OrderSide.LEND,
                    },
                },
            }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            OrderSide.LEND,
            BigNumber.from('5000000'),
            9800,
            BigNumber.from('5000000'),
            undefined
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });

    it('should be called without additionalDepositAmount in LEND orders if wallet source is SF Vault', async () => {
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
        await act(async () => {
            await waitForNextUpdate();
        });
        expect(mock.getOrderEstimation).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.USDC),
            dec22Fixture.toNumber(),
            OrderSide.LEND,
            BigNumber.from('5000000'),
            9800,
            0,
            undefined
        );
        const value = result.current.data;
        expect(value).toEqual(5500);
    });
});
