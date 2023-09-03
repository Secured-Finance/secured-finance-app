import { preloadedLendingMarkets } from 'src/stories/mocks/fixtures';
import { renderHook } from 'src/test-utils';
import { useMarketLists } from './useMarketList';

const preloadedState = {
    ...preloadedLendingMarkets,
};

describe('useMarketLists', () => {
    it('should return open and itayose markets correctly', () => {
        const { result } = renderHook(() => useMarketLists(), {
            preloadedState,
        });

        expect(result.current.openMarkets).toHaveLength(32);
        expect(result.current.itayoseMarkets).toHaveLength(4);
    });
});
