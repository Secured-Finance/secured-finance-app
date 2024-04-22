import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useOrderFee } from './useOrderFee';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderFeeRate.mockClear());

describe('useOrderFee hook', () => {
    it('should return the order fee for a currency', async () => {
        const { result } = renderHook(() => useOrderFee(CurrencySymbol.WFIL));
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isPending).toEqual(true);

        await waitFor(() => {
            expect(mock.getOrderFeeRate).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.data).toEqual(1);
            expect(newValue.isPending).toEqual(false);
        });
    });

    it('should divide by 100 the returned value', async () => {
        mock.getOrderFeeRate.mockResolvedValueOnce(BigInt(50));
        const { result } = renderHook(() => useOrderFee(CurrencySymbol.WFIL));

        await waitFor(() => {
            expect(mock.getOrderFeeRate).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.data).toEqual(0.5);
        });
    });
});
