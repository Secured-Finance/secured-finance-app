import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useMarketTerminationDate } from './useMarketTerminationDate';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMarketTerminationDate.mockClear());

describe('useMarketTerminationDate hook', () => {
    it('should return the termination date of the market', async () => {
        mock.getMarketTerminationDate.mockResolvedValueOnce(
            BigNumber.from(123)
        );
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketTerminationDate()
        );
        await waitForNextUpdate();
        expect(mock.getMarketTerminationDate).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(123);
    });

    it('should return 0 if the market is not terminated', async () => {
        mock.getMarketTerminationDate.mockResolvedValueOnce(BigNumber.from(0));
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketTerminationDate()
        );
        await waitForNextUpdate();
        expect(mock.getMarketTerminationDate).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(0);
    });
});
