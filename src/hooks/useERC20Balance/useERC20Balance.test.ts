import { UseQueryResult } from '@tanstack/react-query';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import {
    useBalances,
    useCollateralBalances,
    useERC20Balance,
    zeroBalances,
} from './useERC20Balance';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const balanceArray = [
    [CurrencySymbol.WFIL, 10000],
    [CurrencySymbol.WBTC, 300],
    [CurrencySymbol.USDC, 4000],
];

const preloadedState = { wallet: { address: '0x1', ethBalance: 0 } };

describe('useERC20Balance', () => {
    it('should fetch token balance', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useERC20Balance('0x1')
        );

        const queries = result.current as UseQueryResult<unknown>[];
        queries.forEach(query => {
            expect(query.data).toEqual(undefined);
            expect(query.isLoading).toEqual(true);
        });

        await waitForNextUpdate();
        const updatedQueries = result.current as UseQueryResult<unknown>[];
        updatedQueries.forEach((query, index) => {
            expect(query.data).toEqual(balanceArray[index]);
            expect(query.isLoading).toEqual(false);
        });
    });
});

describe('useBalances', () => {
    it('should return balances of all currencies', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBalances(), {
            preloadedState: preloadedState,
        });

        expect(result.current).toEqual(zeroBalances);
        await waitForNextUpdate();
        expect(result.current).toEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WFIL]: 10000,
            [CurrencySymbol.WBTC]: 300,
            [CurrencySymbol.USDC]: 4000,
        });
    });
});

describe('useCollateralBalances', () => {
    it('should return balances of only collateral currencies', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBalances(),
            { preloadedState: preloadedState }
        );

        expect(result.current).toEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WBTC]: 0,
            [CurrencySymbol.USDC]: 0,
        });
        await waitForNextUpdate();
        expect(result.current).toStrictEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WBTC]: 300,
            [CurrencySymbol.USDC]: 4000,
        });
    });
});
