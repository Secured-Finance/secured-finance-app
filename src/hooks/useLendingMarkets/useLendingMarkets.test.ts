import { maturities } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { createCurrencyMap } from 'src/utils';
import timemachine from 'timemachine';
import { useLendingMarkets } from './useLendingMarkets';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-15T00:00:00.00Z',
    });
});

afterEach(() => mock.getOrderBookDetails.mockClear());

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLendingMarkets', () => {
    it('should return a function to fetch the lending markets', async () => {
        const { result } = renderHook(() => useLendingMarkets());
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isPending).toEqual(true);

        await waitFor(() => expect(result.current.isSuccess).toEqual(true));

        const newValue = result.current;

        const expected = createCurrencyMap({});
        expected.ETH = maturities;
        expected.USDC = maturities;
        expected.WBTC = maturities;
        expected.WFIL = maturities;

        expect(newValue.data).toEqual(expected);
        expect(newValue.isPending).toEqual(false);
    });

    it('should increment the name of the contract if it already exists', async () => {
        const lendingMarkets = await mock.getOrderBookDetails();
        mock.getOrderBookDetails.mockResolvedValueOnce([
            ...lendingMarkets,
            { ...lendingMarkets[0], maturity: BigInt('10000') },
        ]);

        const { result } = renderHook(() => useLendingMarkets());
        await waitFor(() => expect(result.current.isSuccess).toEqual(true));

        const newValue = result.current;

        expect(newValue.data.ETH[10000].name).toEqual('DEC2022-1');
    });
});
