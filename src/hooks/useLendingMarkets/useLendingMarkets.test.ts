import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import timemachine from 'timemachine';
import { useLendingMarkets } from './useLendingMarkets';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-15T00:00:00.00Z',
    });
});

describe('useLendingMarkets', () => {
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
            EMPTY: {
                isActive: false,
                maturity: 0,
                name: 'EMPTY',
                utcOpeningDate: 0,
            },
        });
    });
});
