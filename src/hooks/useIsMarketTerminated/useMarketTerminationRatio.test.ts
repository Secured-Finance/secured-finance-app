import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketTerminationRatio } from './useMarketTerminationRatio';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMarketTerminationRatio.mockClear());

describe('useMarketTerminationRatio hook', () => {
    it('should return the ratio of collateral in the vault at the time of termination', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketTerminationRatio()
        );

        expect(result.current.data).toEqual([]);
        await waitForNextUpdate();

        expect(mock.getMarketTerminationRatio).toHaveBeenCalledTimes(3); // 3 collateral tokens
        expect(result.current.data).toEqual([
            { currency: CurrencySymbol.ETH, ratio: 2000 },
            { currency: CurrencySymbol.WBTC, ratio: 4000 },
            { currency: CurrencySymbol.USDC, ratio: 4000 },
        ]);
    });
});
