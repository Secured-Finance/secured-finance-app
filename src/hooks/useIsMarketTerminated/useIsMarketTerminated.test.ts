import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useIsMarketTerminated } from './useIsMarketTerminated';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.isTerminated.mockClear());

describe('useIsMarketTerminated hook', () => {
    it('should return the status of the market', async () => {
        mock.isTerminated.mockResolvedValueOnce(true);
        const { result } = renderHook(() => useIsMarketTerminated());
        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(mock.isTerminated).toHaveBeenCalledTimes(1);
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.data).toEqual(true);
        });
    });

    it('should return false if the market is not terminated', async () => {
        mock.isTerminated.mockResolvedValueOnce(false);
        const { result } = renderHook(() => useIsMarketTerminated());

        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(mock.isTerminated).toHaveBeenCalledTimes(1);
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.data).toEqual(false);
        });
    });
});
