import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useLendingMarkets } from './useLendingMarkets';

const mock = mockUseSF();

describe('useLendingMarkets', () => {
    it('should insert the lending market contract into the store', async () => {
        const { store, waitFor } = renderHook(() =>
            useLendingMarkets(
                CurrencySymbol.ETH,
                mock as unknown as SecuredFinanceClient
            )
        );
        waitFor(() => {
            expect(
                store.getState().availableContracts.lendingMarkets[
                    CurrencySymbol.ETH
                ]
            ).toEqual({
                'ETH-1000': {
                    ccy: CurrencySymbol.ETH,
                    maturity: 1000,
                    name: 'ETH-1000',
                },
                'ETH-2000': {
                    ccy: CurrencySymbol.ETH,
                    maturity: 2000,
                    name: 'ETH-2000',
                },
            });
        });
    });

    it('should return the initial state of the store if the client is not defined', async () => {
        const { store } = renderHook(() =>
            useLendingMarkets(CurrencySymbol.ETH, undefined)
        );

        expect(
            store.getState().availableContracts.lendingMarkets[
                CurrencySymbol.ETH
            ]
        ).toEqual({
            DUMMY: {
                ccy: CurrencySymbol.ETH,
                maturity: 0,
                name: 'DUMMY',
            },
        });
    });
});
