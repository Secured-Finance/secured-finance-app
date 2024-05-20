import {
    dec22Fixture,
    ethBytes32,
    jun23Fixture,
    mar23Fixture,
    maturitiesMockFromContract,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useIsGlobalItayose } from './useIsGlobalItayose';

const noOpenMarkets = [
    {
        name: 'DEC2022',
        maturity: BigInt(dec22Fixture.toString()),
        openingDate: BigInt('1685587600'),
        marketUnitPrice: BigInt('9001'),
        openingUnitPrice: BigInt('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigInt('9615'),
        bestLendUnitPrice: BigInt('9617'),
        minBorrowUnitPrice: BigInt('9602'),
        maxLendUnitPrice: BigInt('9630'),
        currentMinDebtUnitPrice: BigInt('9500'),
        ccy: ethBytes32,
        preOpeningDate: BigInt('1684982800'),
        lastBlockUnitPriceTimestamp: BigInt('1646920200'),
    },
    {
        name: 'MAR2023',
        maturity: BigInt(mar23Fixture.toString()),
        openingDate: BigInt('1685587600'),
        marketUnitPrice: BigInt('9001'),
        openingUnitPrice: BigInt('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigInt('9615'),
        bestLendUnitPrice: BigInt('9617'),
        minBorrowUnitPrice: BigInt('9602'),
        maxLendUnitPrice: BigInt('9630'),
        currentMinDebtUnitPrice: BigInt('9500'),
        ccy: ethBytes32,
        preOpeningDate: BigInt('1684982800'),
        lastBlockUnitPriceTimestamp: BigInt('1646920200'),
    },
    {
        name: 'JUN2023',
        maturity: BigInt(jun23Fixture.toString()),
        openingDate: BigInt('1685587600'),
        marketUnitPrice: BigInt('9001'),
        openingUnitPrice: BigInt('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigInt('9615'),
        bestLendUnitPrice: BigInt('9617'),
        minBorrowUnitPrice: BigInt('9602'),
        maxLendUnitPrice: BigInt('9630'),
        currentMinDebtUnitPrice: BigInt('9500'),
        ccy: ethBytes32,
        preOpeningDate: BigInt('1684982800'),
        lastBlockUnitPriceTimestamp: BigInt('1646920200'),
    },
];

const noItayoseMarkets = maturitiesMockFromContract(wfilBytes32).slice(0, 8);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderBookDetails.mockClear());

describe('useIsGlobalItayose', () => {
    it('should return true if there are no open market and at least 1 itayose market exists', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...noOpenMarkets,
        ]);
        const { result } = renderHook(() => useIsGlobalItayose());
        await waitFor(() => expect(result.current.data).toEqual(true));
    });

    it('should return false if itayose and open markets exist', async () => {
        const { result } = renderHook(() => useIsGlobalItayose());
        await waitFor(() => expect(result.current.data).toEqual(false));
    });

    it('should return false if there are no itayose markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...noItayoseMarkets,
        ]);
        const { result } = renderHook(() => useIsGlobalItayose());
        await waitFor(() => expect(result.current.data).toEqual(false));
    });
});
