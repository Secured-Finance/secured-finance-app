import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCollateralBalances } from './useCollateralBalances';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = { wallet: { address: '0x1', balance: 0 } };

describe('useCollateralBalances', () => {
    it('should return balances of only collateral currencies', async () => {
        const { result } = renderHook(() => useCollateralBalances(), {
            preloadedState: preloadedState,
        });

        await waitFor(() => {
            expect(result.current).toEqual({});
        });

        await waitFor(() =>
            expect(mock.getERC20Balance).toHaveBeenCalledTimes(3),
        );

        // Necessary to clone as bigint cannot be serialized
        expect(JSON.parse(JSON.stringify(result.current))).toEqual({
            [CurrencySymbol.USDC]: '4000000000',
            [CurrencySymbol.ETH]: '0',
            [CurrencySymbol.WBTC]: '30000000000',
        });
    });
});
