import { dec22Fixture, dec24Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketPhase } from './useMarketPhase';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderBookDetails.mockClear());

describe('useMarketPhase', () => {
    it('should return the market phase as Open', async () => {
        const maturity = dec22Fixture.toNumber();
        const { result } = renderHook(() =>
            useMarketPhase(CurrencySymbol.ETH, maturity)
        );

        // Initially should be 'Not Found' before data loads
        expect(result.current).toEqual('Not Found');

        // Wait for the hook to complete its query and return 'Open'
        await waitFor(() => {
            expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1);
            expect(result.current).toEqual('Open');
        });
    });

    it('should return the market phase as Pre Order', async () => {
        const maturity = dec24Fixture.toNumber();
        const { result } = renderHook(() =>
            useMarketPhase(CurrencySymbol.ETH, maturity)
        );
        const value = result.current;
        expect(value).toEqual('Not Found');

        await waitFor(() =>
            expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1)
        );
        await waitFor(() => expect(result.current).toEqual('Pre Order'));
    });
});
