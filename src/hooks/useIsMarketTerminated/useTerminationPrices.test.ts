import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useTerminationPrices } from './useTerminationPrices';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getMarketTerminationPrice.mockClear());

describe('useTerminationPrices hook', () => {
    it('should a map with the prices of all collateral tokens', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useTerminationPrices()
        );
        expect(result.current.data).toEqual(undefined);
        await waitForNextUpdate();
        expect(mock.getMarketTerminationPrice).toHaveBeenCalledTimes(3); // 3 collateral tokens
        expect(result.current.data).toEqual({
            [CurrencySymbol.ETH]: 1577.71480752,
            [CurrencySymbol.USDC]: 1.0,
            [CurrencySymbol.WBTC]: 25577.71480752,
        });
    });
});
