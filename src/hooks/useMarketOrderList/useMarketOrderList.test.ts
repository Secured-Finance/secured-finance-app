import { BigNumber } from 'ethers';
import { dec24Fixture, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketOrderList } from './useMarketOrderList';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderList', () => {
    it('should return an empty array if no orders match the given criteria', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketOrderList('0x1', CurrencySymbol.ETH, 123)
        );

        expect(result.current).toEqual([]);
        await waitForNextUpdate();
        expect(result.current).toEqual([]);
    });

    it('should return an array of orders that match the given criteria', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketOrderList(
                'account',
                CurrencySymbol.WFIL,
                dec24Fixture.toNumber()
            )
        );
        await waitForNextUpdate();

        expect(result.current).toEqual([
            {
                orderId: BigNumber.from(5),
                currency: wfilBytes32,
                side: 1,
                maturity: dec24Fixture.toString(),
                unitPrice: BigNumber.from('7800'),
                amount: BigNumber.from('100000000000000000000'),
                createdAt: BigNumber.from('1409220000'),
                isPreOrder: true,
            },
        ]);
    });

    it('should filter the orders by the given filter function', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useMarketOrderList(
                'account',
                CurrencySymbol.WFIL,
                dec24Fixture.toNumber(),
                order => order.unitPrice.eq(BigNumber.from('7800'))
            )
        );
        await waitForNextUpdate();

        expect(result.current).toEqual([
            {
                orderId: BigNumber.from(5),
                currency: wfilBytes32,
                side: 1,
                maturity: dec24Fixture.toString(),
                unitPrice: BigNumber.from('7800'),
                amount: BigNumber.from('100000000000000000000'),
                createdAt: BigNumber.from('1409220000'),
                isPreOrder: true,
            },
        ]);
    });
});
