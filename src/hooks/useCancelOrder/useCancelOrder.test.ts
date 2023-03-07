import { renderHook } from '@testing-library/react-hooks';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { CurrencySymbol } from 'src/utils';
import { useCancelOrder } from './';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('usePlaceOrder hook', () => {
    it('should return the placeOrder function', () => {
        const { result } = renderHook(() => useCancelOrder());
        expect(result.current.handleCancelOrder).toBeInstanceOf(Function);
    });

    it('should call the cancelOrder function', () => {
        const { result } = renderHook(() => useCancelOrder());
        result.current.handleCancelOrder(123, CurrencySymbol.ETH, dec22Fixture);
        expect(mockSecuredFinance.cancelLendingOrder).toBeCalled();
    });
});
