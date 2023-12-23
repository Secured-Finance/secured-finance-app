import { ethBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencies } from './useCurrencies';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe.skip('useCurrencies', () => {
    it('should return the list of currencies in order', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useCurrencies());
        await waitForNextUpdate();
        expect(result.current.data).toEqual([
            CurrencySymbol.WBTC,
            CurrencySymbol.ETH,
            CurrencySymbol.WFIL,
            CurrencySymbol.USDC,
        ]);
    });

    it('should filter out currencies that are not supported', async () => {
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32, '0x0']);
        const { result, waitForNextUpdate } = renderHook(() => useCurrencies());
        await waitForNextUpdate();
        expect(result.current.data).toEqual([CurrencySymbol.ETH]);
    });
});
