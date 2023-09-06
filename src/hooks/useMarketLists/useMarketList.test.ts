import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useMarketLists } from './useMarketList';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe.skip('useMarketLists', () => {
    it('should return open and itayose markets correctly', () => {
        const { result } = renderHook(() => useMarketLists());

        expect(result.current.openMarkets).toHaveLength(32);
        expect(result.current.itayoseMarkets).toHaveLength(4);
    });
});
