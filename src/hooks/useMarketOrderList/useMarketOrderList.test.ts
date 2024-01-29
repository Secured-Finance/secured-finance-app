import { dec24Fixture, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useMarketOrderList } from './useMarketOrderList';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderList', () => {
    it('should return an empty array if no orders match the given criteria', async () => {
        const { result } = renderHook(() =>
            useMarketOrderList('0x1', CurrencySymbol.ETH, 123)
        );

        expect(result.current).toEqual([]);
        await waitFor(() => expect(result.current).toEqual([]));
    });

    it('should return an array of orders that match the given criteria', async () => {
        const { result } = renderHook(() =>
            useMarketOrderList(
                'account',
                CurrencySymbol.WFIL,
                dec24Fixture.toNumber()
            )
        );

        await waitFor(() => expect(result.current).toHaveLength(21));
    });

    it('should filter the orders by the given filter function', async () => {
        mock.getOrderList.mockResolvedValueOnce({
            activeOrders: [
                {
                    orderId: 3,
                    ccy: wfilBytes32,
                    side: 1,
                    maturity: BigInt(dec24Fixture.toString()),
                    unitPrice: BigInt('9800'),
                    amount: BigInt('100000000000000000000'),
                    timestamp: BigInt('1609205000'),
                    isPreOrder: false,
                },
                {
                    orderId: 4,
                    ccy: wfilBytes32,
                    side: 1,
                    maturity: BigInt(dec24Fixture.toString()),
                    unitPrice: BigInt('7800'),
                    amount: BigInt('100000000000000000000'),
                    timestamp: BigInt('1409220000'),
                    isPreOrder: true,
                },
            ],
            inactiveOrders: [],
        });
        const { result } = renderHook(() =>
            useMarketOrderList(
                'account',
                CurrencySymbol.WFIL,
                dec24Fixture.toNumber(),
                order => order.unitPrice === BigInt('7800')
            )
        );

        await waitFor(() =>
            expect(result.current).toEqual([
                {
                    orderId: BigInt(4),
                    currency: wfilBytes32,
                    side: 1,
                    maturity: dec24Fixture.toString(),
                    unitPrice: BigInt('7800'),
                    amount: BigInt('100000000000000000000'),
                    createdAt: BigInt('1409220000'),
                    isPreOrder: true,
                },
            ])
        );
    });
});
