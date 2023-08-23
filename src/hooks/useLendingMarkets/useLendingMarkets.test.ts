import { BigNumber } from 'ethers';
import { maturities } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
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

describe('useLendingMarkets1', () => {
    it('should return a function to fetch the lending markets', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLendingMarkets()
        );
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();

        expect(mock.getOrderBookDetails).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue.data).toEqual({
            ETH: maturities,
            USDC: maturities,
            WBTC: maturities,
            WFIL: maturities,
        });
        expect(newValue.isLoading).toEqual(false);
    });

    it('should increment the name of the contract if it already exists', async () => {
        const lendingMarkets = await mock.getOrderBookDetails();
        mock.getOrderBookDetails.mockResolvedValueOnce([
            ...lendingMarkets,
            { ...lendingMarkets[0], maturity: BigNumber.from('10000') },
        ]);

        const { result, waitForNextUpdate } = renderHook(() =>
            useLendingMarkets()
        );
        await waitForNextUpdate();
        const newValue = result.current;

        expect(newValue.data.ETH[10000].name).toEqual('DEC22-1');
    });
});
