import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, ZERO_BN } from 'src/utils';
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

    it('should trim the orderbook from the zeros but keep the borrow and lending orderbook the same size', async () => {
        const maturity = new Maturity(1675252800);
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
            useOrderbook(CurrencySymbol.ETH, maturity)
        );

        expect(result.current).toEqual({
            borrowOrderbook: [],
            lendOrderbook: [],
        });

        await waitForNextUpdate();

        expect(result.current.borrowOrderbook.length).toBe(6);
        expect(result.current.lendOrderbook.length).toBe(6);
    });
});
