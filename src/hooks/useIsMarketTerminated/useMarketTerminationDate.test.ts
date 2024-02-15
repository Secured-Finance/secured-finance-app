import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { ZERO_BI } from 'src/utils';
import { useMarketTerminationDate } from './useMarketTerminationDate';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMarketTerminationDate.mockClear());

describe('useMarketTerminationDate hook', () => {
    it('should return the termination date of the market', async () => {
        mock.getMarketTerminationDate.mockResolvedValueOnce(BigInt(123));
        const { result } = renderHook(() => useMarketTerminationDate());

        await waitFor(() => {
            expect(mock.getMarketTerminationDate).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(123);
        });
    });

    it('should return 0 if the market is not terminated', async () => {
        mock.getMarketTerminationDate.mockResolvedValueOnce(ZERO_BI);
        const { result } = renderHook(() => useMarketTerminationDate());

        await waitFor(() => {
            expect(mock.getMarketTerminationDate).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(0);
        });
    });
});
