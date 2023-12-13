import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCollateralBalances } from './useCollateralBalances';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = { wallet: { address: '0x1', ethBalance: 0 } };

describe('useCollateralBalances', () => {
    it('should return balances of only collateral currencies', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBalances(),
            { preloadedState: preloadedState }
        );

        expect(result.current).toEqual({});
        await waitForNextUpdate();
        await waitForNextUpdate();
        expect(result.current).toEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WBTC]: 300,
            [CurrencySymbol.USDC]: 4000,
        });
    });
});
