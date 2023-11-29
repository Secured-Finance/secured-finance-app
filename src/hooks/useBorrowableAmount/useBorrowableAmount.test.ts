import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useBorrowableAmount } from './useBorrowableAmount';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useBorrowableAmount', () => {
    it('should fetch borrowable balance', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useBorrowableAmount('0x1', CurrencySymbol.WBTC)
        );

        const value = result.current;
        expect(value.data).toEqual(0);

        await waitForNextUpdate();
        expect(mock.getBorrowableAmount).toHaveBeenCalledTimes(1);

        const newValue = result.current;
        expect(newValue.data).toEqual(0.1);
    });
});
