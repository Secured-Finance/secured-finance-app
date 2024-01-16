import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useMarketLists } from './useMarketList';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useMarketList', () => {
    it('should return all open and itayose markets', async () => {
        jest.spyOn(mockSecuredFinance, 'currencyExists').mockResolvedValue(
            true
        );
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketLists()
        );

        await waitForNextUpdate();
        await waitForNextUpdate();
        await waitForNextUpdate();

        expect(result.current.openMarkets).toHaveLength(32);
        expect(result.current.itayoseMarkets).toHaveLength(4);
    });
});
