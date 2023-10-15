import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useMarketLists } from './useMarketList';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useMarketList', () => {
    it('should not add delistedCurrencies to itayose market list', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketLists()
        );

        await waitForNextUpdate();

        await waitFor(() => {
            expect(result.current.openMarkets).toHaveLength(32);
            expect(result.current.itayoseMarkets).toHaveLength(3);
        });
    });

    it('should return all open and itayose markets if no currency is delisted', async () => {
        jest.spyOn(mockSecuredFinance, 'currencyExists').mockResolvedValue(
            true
        );
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketLists()
        );

        await waitForNextUpdate();

        expect(result.current.openMarkets).toHaveLength(32);
        expect(result.current.itayoseMarkets).toHaveLength(4);
    });
});
