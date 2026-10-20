import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMinimumPreOrderAmount } from './useMinimumPreOrderAmount';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMinPreOrderAmount.mockClear());

describe('useMinimumPreOrderAmount hook', () => {
    it('should return the minimum pre-order amount for a currency', async () => {
        mock.getMinPreOrderAmount.mockResolvedValueOnce(BigInt(100000000));

        const { result } = renderHook(() =>
            useMinimumPreOrderAmount(CurrencySymbol.WBTC)
        );

        await waitFor(() => {
            expect(mock.getMinPreOrderAmount).toHaveBeenCalledTimes(1);
            expect(mock.getMinPreOrderAmount).toHaveBeenCalledWith(
                expect.objectContaining({ symbol: CurrencySymbol.WBTC })
            );
            expect(result.current.data).toEqual(BigInt(100000000));
        });
    });

    it('should not fetch the amount when disabled', () => {
        const { result } = renderHook(() =>
            useMinimumPreOrderAmount(CurrencySymbol.WBTC, false)
        );

        expect(result.current.fetchStatus).toEqual('idle');
        expect(mock.getMinPreOrderAmount).not.toHaveBeenCalled();
    });
});
