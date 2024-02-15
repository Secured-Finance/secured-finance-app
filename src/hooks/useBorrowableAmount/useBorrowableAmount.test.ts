import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useBorrowableAmount } from './useBorrowableAmount';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useBorrowableAmount', () => {
    it('should fetch borrowable balance', async () => {
        const { result } = renderHook(() =>
            useBorrowableAmount('0x1', CurrencySymbol.WBTC)
        );

        const value = result.current;
        expect(value.data).toEqual(0);

        await waitFor(() => {
            expect(mock.tokenVault.getBorrowableAmount).toHaveBeenCalledTimes(
                1
            );
            expect(result.current.data).toEqual(0.1);
        });
    });
});
