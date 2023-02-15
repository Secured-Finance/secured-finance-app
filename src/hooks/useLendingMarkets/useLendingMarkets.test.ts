import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useLendingMarkets } from './useLendingMarkets';

const mock = mockUseSF();

describe('useLendingMarkets', () => {
    it('should insert the lending market contract into the store', async () => {
        const { store, waitFor } = renderHook(() =>
            useLendingMarkets(mock as unknown as SecuredFinanceClient)
        );
        waitFor(() => {
            expect(
                Object.keys(store.getState().availableContracts.lendingMarkets)
            ).toHaveLength(4);
            expect(
                store.getState().availableContracts.lendingMarkets[
                    CurrencySymbol.ETH
                ]
            ).toEqual({
                'ETH-1000': 1000,
                'ETH-2000': 2000,
            });
        });
    });

    it('should return the initial state of the store if the client is not defined', async () => {
        const { store } = renderHook(() => useLendingMarkets(undefined));
        expect(
            Object.keys(store.getState().availableContracts.lendingMarkets)
        ).toHaveLength(4);
        expect(
            store.getState().availableContracts.lendingMarkets[
                CurrencySymbol.ETH
            ]
        ).toEqual({
            '': 0,
        });
    });
});
