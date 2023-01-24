import { renderHook } from '@testing-library/react-hooks';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { CurrencySymbol } from 'src/utils';
import { useCancelOrder } from './';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('usePlaceOrder hook', () => {
    it('should return the placeOrder function', () => {
        const { result } = renderHook(() =>
            useCancelOrder(CurrencySymbol.ETH, dec22Fixture, 123)
        );
        expect(result.current.onCancelOrder).toBeInstanceOf(Function);
    });

    it('should call the cancelOrder function', () => {
        const { result } = renderHook(() =>
            useCancelOrder(CurrencySymbol.ETH, dec22Fixture, 123)
        );
        result.current.onCancelOrder();
        expect(mockSecuredFinance.cancelLendingOrder).toBeCalled();
    });
});
