import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCollateralBalances } from './useCollateralBalances';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = {
    wallet: { address: '0x1', ethBalance: 0 },
    blockchain: { chainId: 1 },
};

describe('useCollateralBalances', () => {
    it('should return balances of only collateral currencies', async () => {
        const { result } = renderHook(() => useCollateralBalances(), {
            preloadedState: preloadedState,
        });

        expect(result.current).toEqual({});
        await waitFor(() =>
            expect(mock.getERC20Balance).toHaveBeenCalledTimes(3)
        );
        expect(result.current).toEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WBTC]: 300,
            [CurrencySymbol.USDC]: 4000,
        });
    });
});
