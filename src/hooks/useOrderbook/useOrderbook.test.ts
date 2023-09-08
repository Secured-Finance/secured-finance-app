import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, ZERO_BN } from 'src/utils';
import { useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);
const maturity = 1675252800;

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 5, 5)
        );

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        expect(result.current.data.borrowOrderbook.length).toBe(5);
        expect(result.current.data.lendOrderbook.length).toBe(5);
    });

    it('should trim the orderbook from the zeros but keep the borrow and lending orderbook the same size', async () => {
        const base = {
            unitPrices: [
                BigNumber.from(9690),
                BigNumber.from(9687),
                BigNumber.from(9685),
                BigNumber.from(9679),
            ],
            amounts: [
                BigNumber.from('43000000000000000000000'),
                BigNumber.from('23000000000000000000000'),
                BigNumber.from('15000000000000000000000'),
                BigNumber.from('12000000000000000000000'),
            ],
            quantities: [
                BigNumber.from('1000'),
                BigNumber.from('2000'),
                BigNumber.from('3000'),
                BigNumber.from('4000'),
            ],
        };
        mock.getLendOrderBook.mockResolvedValueOnce({
            unitPrices: [...base.unitPrices, ZERO_BN, ZERO_BN, ZERO_BN],
            amounts: [...base.amounts, ZERO_BN, ZERO_BN, ZERO_BN],
            quantities: [...base.quantities, ZERO_BN, ZERO_BN, ZERO_BN],
        });

        mock.getBorrowOrderBook.mockResolvedValueOnce({
            unitPrices: [
                ...base.unitPrices,
                BigNumber.from(9674),
                BigNumber.from(9664),
                ZERO_BN,
            ],
            amounts: [
                ...base.amounts,
                BigNumber.from('12000000000000000000000'),
                BigNumber.from('12000000000000000000000'),
                ZERO_BN,
            ],
            quantities: [
                ...base.quantities,
                BigNumber.from('4000'),
                BigNumber.from('4000'),
                ZERO_BN,
            ],
        });

        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 40, 0)
        );

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        expect(result.current.data.borrowOrderbook.length).toBe(6);
        expect(result.current.data.lendOrderbook.length).toBe(6);
    });

    it('should return an orderbook with one line even if there is no orders in the orderbook', async () => {
        const emptyOrderbook = {
            unitPrices: [ZERO_BN, ZERO_BN, ZERO_BN],
            amounts: [ZERO_BN, ZERO_BN, ZERO_BN],
            quantities: [ZERO_BN, ZERO_BN, ZERO_BN],
        };

        mock.getLendOrderBook.mockResolvedValueOnce(emptyOrderbook);
        mock.getBorrowOrderBook.mockResolvedValueOnce(emptyOrderbook);
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 40, 0)
        );

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        expect(result.current.data.borrowOrderbook.length).toBe(1);
        expect(result.current.data.lendOrderbook.length).toBe(1);
    });

    it('should return an orderbook with a minimum number of line even if there is no orders in the orderbook', async () => {
        const emptyOrderbook = {
            unitPrices: [ZERO_BN, ZERO_BN, ZERO_BN],
            amounts: [ZERO_BN, ZERO_BN, ZERO_BN],
            quantities: [ZERO_BN, ZERO_BN, ZERO_BN],
        };

        mock.getLendOrderBook.mockResolvedValueOnce(emptyOrderbook);
        mock.getBorrowOrderBook.mockResolvedValueOnce(emptyOrderbook);
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, maturity, 40, 5)
        );

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        expect(result.current.data.borrowOrderbook.length).toBe(5);
        expect(result.current.data.lendOrderbook.length).toBe(5);
    });
});
