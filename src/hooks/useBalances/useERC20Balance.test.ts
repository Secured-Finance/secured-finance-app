import { UseQueryResult } from '@tanstack/react-query';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useERC20Balance } from './useERC20Balance';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const balanceArray = [
    [CurrencySymbol.WBTC, BigInt('30000000000')],
    [CurrencySymbol.WFIL, BigInt('10000000000000000000000')],
    [CurrencySymbol.USDC, BigInt('4000000000')],
];

describe('useERC20Balance', () => {
    it('should fetch token balance', async () => {
        const { result } = renderHook(() => useERC20Balance('0x1'));

        const queries = result.current as UseQueryResult<unknown>[];
        queries.forEach(query => {
            expect(query.data).toEqual(undefined);
            expect(query.isPending).toEqual(true);
        });

        const updatedQueries = result.current as UseQueryResult<unknown>[];
        updatedQueries.forEach(async (query, index) => {
            await waitFor(() => {
                expect(query.data).toEqual(balanceArray[index]);
                expect(query.isPending).toEqual(false);
            });
        });
    });
});
