import { OrderSide } from '@secured-finance/sf-client';
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
    it('should return two functions', () => {
        const { result } = renderHook(() => useOrders());
        expect(result.current.handleCancelOrder).toBeInstanceOf(Function);
        expect(result.current.placeOrder).toBeInstanceOf(Function);
    });

    describe('cancel order', () => {
        it('should return the handleCancelOrder function', () => {
            const { result } = renderHook(() => useOrders());
            expect(result.current.handleCancelOrder).toBeInstanceOf(Function);
        });

        it('should call the handleCancelOrder function', () => {
            const { result } = renderHook(() => useOrders());
            result.current.handleCancelOrder(
                123,
                CurrencySymbol.ETH,
                dec22Fixture
            );
            expect(mockSecuredFinance.cancelLendingOrder).toBeCalled();
        });
    });

    describe('place order', () => {
        it('should return the placeOrder function', () => {
            const { result } = renderHook(() => useOrders());
            expect(result.current.placeOrder).toBeInstanceOf(Function);
        });

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
            expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledTimes(
                1
            );
            expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledWith(
                toCurrency(CurrencySymbol.ETH),
                2022,
                '0',
                BigNumber.from('1000000000000000000'),
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
                currencyMap.ETH.toBaseUnit(1)
            );

            expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledWith(
                toCurrency(CurrencySymbol.ETH),
                2022,
                '0',
                BigNumber.from('1000000000000000000'),
                undefined
            );
        });
    });
});
