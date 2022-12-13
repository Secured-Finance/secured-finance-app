import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { OrderSide, usePlaceOrder } from './';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('usePlaceOrder hook', () => {
    it('should return the placeOrder function', () => {
        const { result } = renderHook(() => usePlaceOrder());
        expect(result.current.placeOrder).toBeInstanceOf(Function);
    });

    it('should call the SDK in wei when used with ETH', async () => {
        const { result } = renderHook(() => usePlaceOrder());
        const placeOrder = result.current.placeOrder;
        await placeOrder(
            CurrencySymbol.ETH,
            2022,
            OrderSide.Lend,
            currencyMap.ETH.toBaseUnit(1),
            9863
        );
        expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledTimes(1);
    });
});
