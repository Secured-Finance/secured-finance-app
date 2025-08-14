import { dec22Fixture, maturities } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarket } from './useMarket';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useMarket', () => {
    it('should return the corresponding market', async () => {
        const maturity = dec22Fixture.toNumber();
        const { result } = renderHook(() =>
            useMarket(CurrencySymbol.ETH, maturity),
        );
        const value = result.current;
        expect(value).toEqual(undefined);

        await waitFor(() =>
            expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1),
        );

        await waitFor(() =>
            expect(result.current).toEqual(maturities[maturity]),
        );
    });
});
