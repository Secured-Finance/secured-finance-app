import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { usePlaceOrder } from './';

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
        await placeOrder('ETH', '2022', 0, 1, 1);
        expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledTimes(1);
    });
});
