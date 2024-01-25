import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useMarketLists } from './useMarketList';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useMarketList', () => {
    it('should return all open and itayose markets', async () => {
        jest.spyOn(mockSecuredFinance, 'currencyExists').mockResolvedValue(
            true
        );
        const { result } = renderHook(() => useMarketLists());

        await waitFor(() =>
            expect(result.current.openMarkets).toHaveLength(32)
        );
        await waitFor(() =>
            expect(result.current.itayoseMarkets).toHaveLength(4)
        );
    });
});
