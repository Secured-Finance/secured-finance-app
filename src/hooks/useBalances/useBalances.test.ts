import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { ZERO_BI, createCurrencyMap } from 'src/utils';
import { useBalances } from './useBalances';
import { initialStore } from 'src/stories/mocks/mockStore';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useBalances', () => {
    it('should return full balances of all currencies', async () => {
        const { result } = renderHook(() => useBalances(), {
            preloadedState: initialStore,
        });

        const expected = createCurrencyMap<bigint>(ZERO_BI);

        expect(result.current).toEqual(expected);
        expect(Object.values(result.current).length).toEqual(13);
    });
});
