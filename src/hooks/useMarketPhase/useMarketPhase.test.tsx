import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useMarketPhase } from './useMarketPhase';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useMarketPhase', () => {
    it('should insert the market phase in the store', async () => {
        const { result, waitFor, waitForNextUpdate, store } = renderHook(() =>
            useMarketPhase(mock as unknown as SecuredFinanceClient)
        );

        await waitFor(() => expect(result).not.toBeNull());
        await waitForNextUpdate();

        expect(store.getState().landingOrderForm.marketPhase).toEqual('Open');
    });
});
