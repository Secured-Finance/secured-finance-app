import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencyDelistedStatus } from './useCurrencyDelistedStatus';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrencyDelistedStatus hook', () => {
    it('should return a set of delisted currencies', async () => {
        const { result } = renderHook(() => useCurrencyDelistedStatus());

        const delistedCurrencySet = new Set([CurrencySymbol.USDC]);

        await waitFor(() =>
            expect(mock.currencyExists).toHaveBeenCalledTimes(4)
        );
        const newValue = result.current;
        expect(newValue.data).toEqual(delistedCurrencySet);
    });
});
