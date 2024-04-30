import { renderHook } from 'src/test-utils';
import { useIsSubgraphSupported } from './useIsSubgraphSupported';

jest.mock('src/utils/env', () => ({
    getNonSubgraphSupportedChainIds: () => [314, 314159],
}));

describe('useIsSubgraphSupported', () => {
    it('should return true if the current currency supports subgraphs', async () => {
        const currencyId = 1;
        const { result } = renderHook(() => useIsSubgraphSupported(currencyId));
        expect(result.current).toEqual(true);
    });

    it('should return false if the current currency does not support subgraphs', async () => {
        const currencyId = 314;
        const { result } = renderHook(() => useIsSubgraphSupported(currencyId));
        expect(result.current).toEqual(false);
    });
});
