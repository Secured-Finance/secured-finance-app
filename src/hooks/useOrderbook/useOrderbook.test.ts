import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates', async () => {
        const maturity = new Maturity(1675252800);
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 5)
        );

        expect(result.current).toEqual({
            borrowOrderbook: [],
            lendOrderbook: [],
        });

        await waitForNextUpdate();

        expect(result.current.borrowOrderbook.length).toBe(5);
        expect(result.current.borrowOrderbook[0].value.price).toBe(9674);
        expect(result.current.borrowOrderbook[4].value.price).toBe(9690);

        expect(result.current.lendOrderbook.length).toBe(5);
        expect(result.current.lendOrderbook[0].value.price).toBe(9690);
        expect(result.current.lendOrderbook[4].value.price).toBe(9674);
    });
});
