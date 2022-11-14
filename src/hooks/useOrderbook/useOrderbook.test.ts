import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol, Rate } from 'src/utils';
import { useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, 1, 1)
        );

        expect(result.current).toEqual({
            borrowOrderbook: [],
            lendOrderbook: [],
        });

        await waitForNextUpdate();

        expect(result.current.borrowOrderbook).toEqual([
            {
                amount: BigNumber.from('43000000000000000000000'),
                apy: new Rate(195000),
                price: 100,
            },
            {
                amount: BigNumber.from('23000000000000000000000'),
                apy: new Rate(183000),
                price: 101,
            },
            {
                amount: BigNumber.from('15000000000000000000000'),
                apy: new Rate(180000),
                price: 102,
            },
            {
                amount: BigNumber.from('12000000000000000000000'),
                apy: new Rate(170000),
                price: 103,
            },
            {
                amount: BigNumber.from('1800000000000000000000'),
                apy: new Rate(160000),
                price: 104,
            },
        ]);
    });
});
