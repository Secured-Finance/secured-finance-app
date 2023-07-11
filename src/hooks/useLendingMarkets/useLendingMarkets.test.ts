import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import timemachine from 'timemachine';
import { useLendingMarkets } from './useLendingMarkets';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-15T00:00:00.00Z',
    });
});

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLendingMarkets', () => {
    it('should return a function to fetch the lending markets', async () => {
        const { result } = renderHook(() => useLendingMarkets());
        expect(result.current.fetchLendingMarkets).toBeInstanceOf(Function);
    });

    it('should insert the lending markets in the store', async () => {
        const { result, store } = renderHook(() => useLendingMarkets());
        const fetchLendingMarkets = result.current.fetchLendingMarkets;
        await fetchLendingMarkets(
            CurrencySymbol.EFIL,
            mock as unknown as SecuredFinanceClient
        );
        expect(
            Object.keys(
                store.getState().availableContracts.lendingMarkets[
                    CurrencySymbol.EFIL
                ]
            )
        ).toHaveLength(2);
        expect(
            store.getState().availableContracts.lendingMarkets[
                CurrencySymbol.EFIL
            ]
        ).toEqual({
            1000: {
                isActive: true,
                maturity: 1000,
                name: 'ETH-1000',
                utcOpeningDate: 1620000000,
                midUnitPrice: 100,
                preOpenDate: 1447200000,
                openingUnitPrice: 9686,
                isReady: true,
                isOpened: true,
                isMatured: false,
                isPreOrderPeriod: false,
                isItayosePeriod: false,
                borrowUnitPrice: 9620,
                lendUnitPrice: 9618,
            },
            2000: {
                isActive: false,
                maturity: 2000,
                name: 'ETH-2000',
                utcOpeningDate: 1720000000,
                midUnitPrice: 100,
                preOpenDate: 1547200000,
                openingUnitPrice: 9786,
                isReady: true,
                isOpened: true,
                isMatured: false,
                isPreOrderPeriod: false,
                isItayosePeriod: false,
                borrowUnitPrice: 9610,
                lendUnitPrice: 9608,
            },
        });
    });

    it('should increment the name of the contract if it already exists', async () => {
        const lendingMarkets = await mock.getLendingMarkets();
        mock.getLendingMarkets.mockResolvedValueOnce([
            ...lendingMarkets,
            { ...lendingMarkets[0], maturity: new Maturity(10000) },
        ]);

        const { result, store } = renderHook(() => useLendingMarkets());
        const fetchLendingMarkets = result.current.fetchLendingMarkets;
        await fetchLendingMarkets(
            CurrencySymbol.EFIL,
            mock as unknown as SecuredFinanceClient
        );
        expect(
            Object.keys(
                store.getState().availableContracts.lendingMarkets[
                    CurrencySymbol.EFIL
                ]
            )
        ).toHaveLength(3);
        expect(
            store.getState().availableContracts.lendingMarkets[
                CurrencySymbol.EFIL
            ][10000].name
        ).toEqual('ETH-1000-1');
    });
});
