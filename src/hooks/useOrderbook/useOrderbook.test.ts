import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { OrderBookEntry, useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);
const maturity = 1675252800;

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates and a callback function to set the max number of orders', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 5)
        );

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        expect(result.current[0].data.borrowOrderbook.length).toBe(5);
        expect(result.current[0].data.lendOrderbook.length).toBe(5);

        expect(result.current[1]).toBeInstanceOf(Function);
    });

    it('should return the transformed orderbook', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 5)
        );

        await waitForNextUpdate();

        expect(
            result.current[0].data.borrowOrderbook.map(
                (v: OrderBookEntry) => v.value.price
            )
        ).toEqual([9690, 9687, 9685, 9679, 9674]);

        expect(
            result.current[0].data.borrowOrderbook.map((v: OrderBookEntry) =>
                v.amount.toString()
            )
        ).toEqual([
            '43000000000000000000000',
            '23000000000000000000000',
            '15000000000000000000000',
            '12000000000000000000000',
            '1800000000000000000000',
        ]);
    });
});
