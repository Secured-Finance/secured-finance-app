import { OrderSide } from '@secured-finance/sf-client';
import { WalletSource } from '@secured-finance/sf-client/dist/secured-finance-client';
import { renderHook } from '@testing-library/react-hooks';
import { BigNumber } from 'ethers';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { currencyMap, CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useOrders } from '.';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useOrders hook', () => {
    it('should return four functions', () => {
        const { result } = renderHook(() => useOrders());
        expect(result.current.cancelOrder).toBeInstanceOf(Function);
        expect(result.current.placeOrder).toBeInstanceOf(Function);
        expect(result.current.unwindOrder).toBeInstanceOf(Function);
        expect(result.current.placePreOrder).toBeInstanceOf(Function);
    });

    describe('cancel order', () => {
        it('should call the cancelOrder function', () => {
            const { result } = renderHook(() => useOrders());
            result.current.cancelOrder(123, CurrencySymbol.ETH, dec22Fixture);
            expect(mockSecuredFinance.cancelLendingOrder).toBeCalled();
        });
    });

    describe('place order', () => {
        it('should call the SDK in wei when used with ETH', async () => {
            const { result } = renderHook(() => useOrders());
            const placeOrder = result.current.placeOrder;
            await placeOrder(
                CurrencySymbol.ETH,
                new Maturity(2022),
                OrderSide.LEND,
                currencyMap.ETH.toBaseUnit(1),
                9863
            );
            expect(mockSecuredFinance.placeOrder).toHaveBeenCalledTimes(1);
            expect(mockSecuredFinance.placeOrder).toHaveBeenCalledWith(
                toCurrency(CurrencySymbol.ETH),
                2022,
                '0',
                BigNumber.from('1000000000000000000'),
                WalletSource.METAMASK,
                9863
            );
        });

        it('should call the sdk with a price of 0 when not provided', async () => {
            const { result } = renderHook(() => useOrders());
            const placeOrder = result.current.placeOrder;
            await placeOrder(
                CurrencySymbol.ETH,
                new Maturity(2022),
                OrderSide.LEND,
                currencyMap.ETH.toBaseUnit(1),
                0
            );

            expect(mockSecuredFinance.placeOrder).toHaveBeenCalledWith(
                toCurrency(CurrencySymbol.ETH),
                2022,
                '0',
                BigNumber.from('1000000000000000000'),
                WalletSource.METAMASK,
                undefined
            );
        });
    });

    describe('unwind order', () => {
        it('should call the unwindOrder function', () => {
            const { result } = renderHook(() => useOrders());
            result.current.unwindOrder(CurrencySymbol.EFIL, dec22Fixture);
            expect(mockSecuredFinance.unwindOrder).toBeCalled();
        });
    });

    describe('place pre-order', () => {
        it('should call the SDK in wei when used with ETH', async () => {
            const { result } = renderHook(() => useOrders());
            const placePreOrder = result.current.placePreOrder;
            await placePreOrder(
                CurrencySymbol.ETH,
                new Maturity(2022),
                OrderSide.LEND,
                currencyMap.ETH.toBaseUnit(1),
                9863
            );
            expect(mockSecuredFinance.placePreOrder).toHaveBeenCalledTimes(1);
            expect(mockSecuredFinance.placePreOrder).toHaveBeenCalledWith(
                toCurrency(CurrencySymbol.ETH),
                2022,
                '0',
                BigNumber.from('1000000000000000000'),
                WalletSource.METAMASK,
                9863
            );
        });
    });
});
