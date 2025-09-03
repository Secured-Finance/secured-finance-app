import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useERC20TokenBalance } from './useERC20TokenBalance';
import { initialStore } from 'src/stories/mocks/mockStore';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useERC20TokenBalance', () => {
    it('should return the ZC Token address', async () => {
        const TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
        mock.getERC20TokenBalance.mockResolvedValueOnce(
            BigInt('1000000000000000000')
        );

        const { result } = renderHook(
            () => useERC20TokenBalance(TOKEN_ADDRESS),
            {
                preloadedState: initialStore,
            }
        );

        await waitFor(() =>
            expect(result.current.data.toString()).toEqual(
                '1000000000000000000'
            )
        );
    });
});
