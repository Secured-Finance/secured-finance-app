import { dec22Fixture, dec24Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketPhase } from './useMarketPhase';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderBookDetails.mockClear());

describe('useMarket', () => {
    it('should return the market phase as Open', async () => {
        const maturity = dec22Fixture.toNumber();
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketPhase(CurrencySymbol.ETH, maturity)
        );
        const value = result.current;
        expect(value).toEqual('Not Found');

        await waitForNextUpdate();

        expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue).toEqual('Open');
    });

    it('should return the market phase as Pre Order', async () => {
        const maturity = dec24Fixture.toNumber();
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketPhase(CurrencySymbol.ETH, maturity)
        );
        const value = result.current;
        expect(value).toEqual('Not Found');

        await waitForNextUpdate();

        expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue).toEqual('Pre Order');
    });
});
