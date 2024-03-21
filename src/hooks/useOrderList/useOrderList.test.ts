import { ethBytes32, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils/currencyList';
import { useOrderList } from './useOrderList';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const usedCurrencies = [
    CurrencySymbol.ETH,
    CurrencySymbol.WFIL,
    CurrencySymbol.WBTC,
    CurrencySymbol.USDC,
];

describe('useOrderList', () => {
    it('should return a sorted array of activeOrders and inactiveOrders by creation date', async () => {
        const { result } = renderHook(() =>
            useOrderList('0x1', usedCurrencies)
        );

        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitFor(() => {
            expect(mock.getOrderList).toHaveBeenCalledTimes(1);

            const newValue = result.current;
            expect(newValue.data.activeOrderList.length).toBe(45);
            expect(newValue.data.ordersPerCurrency).toEqual({
                [CurrencySymbol.ETH]: 2,
                [CurrencySymbol.WETHe]: 0,
                [CurrencySymbol.WFIL]: 42,
                [CurrencySymbol.USDC]: 0,
                [CurrencySymbol.WBTC]: 1,
                [CurrencySymbol.BTCb]: 0,
                [CurrencySymbol.aUSDC]: 0,
                [CurrencySymbol.axlFIL]: 0,
            });
            expect(newValue.data.totalPVOfOpenOrdersInUSD).toEqual(252440.374);
            for (let i = 0; i < newValue.data.activeOrderList.length - 1; i++) {
                expect(
                    newValue.data.activeOrderList[i].createdAt >=
                        newValue.data.activeOrderList[i + 1].createdAt
                ).toBeTruthy();
            }

            expect(newValue.data.inactiveOrderList.length).toBe(2);
            expect(newValue.data.inactiveOrderList[0].currency).toBe(
                ethBytes32
            );
            expect(newValue.data.inactiveOrderList[1].currency).toBe(
                wfilBytes32
            );
            expect(newValue.isLoading).toEqual(false);
        });
    });
});
