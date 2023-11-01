import { BigNumber } from 'ethers';
import {
    dec22Fixture,
    ethBytes32,
    jun23Fixture,
    mar23Fixture,
    maturitiesMockFromContract,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useIsGlobalItayose } from './useIsGlobalItayose';

const noOpenMarkets = [
    {
        name: 'DEC22',
        maturity: BigNumber.from(dec22Fixture.toString()),
        openingDate: BigNumber.from('1685587600'),
        marketUnitPrice: BigNumber.from('9001'),
        openingUnitPrice: BigNumber.from('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigNumber.from('9615'),
        bestLendUnitPrice: BigNumber.from('9617'),
        minBorrowUnitPrice: BigNumber.from('9602'),
        maxLendUnitPrice: BigNumber.from('9630'),
        ccy: ethBytes32,
    },
    {
        name: 'MAR23',
        maturity: BigNumber.from(mar23Fixture.toString()),
        openingDate: BigNumber.from('1685587600'),
        marketUnitPrice: BigNumber.from('9001'),
        openingUnitPrice: BigNumber.from('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigNumber.from('9615'),
        bestLendUnitPrice: BigNumber.from('9617'),
        minBorrowUnitPrice: BigNumber.from('9602'),
        maxLendUnitPrice: BigNumber.from('9630'),
        ccy: ethBytes32,
    },
    {
        name: 'JUN23',
        maturity: BigNumber.from(jun23Fixture.toString()),
        openingDate: BigNumber.from('1685587600'),
        marketUnitPrice: BigNumber.from('9001'),
        openingUnitPrice: BigNumber.from('9710'),
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: BigNumber.from('9615'),
        bestLendUnitPrice: BigNumber.from('9617'),
        minBorrowUnitPrice: BigNumber.from('9602'),
        maxLendUnitPrice: BigNumber.from('9630'),
        ccy: ethBytes32,
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
        const { result, waitForNextUpdate } = renderHook(() =>
            useIsGlobalItayose()
        );
        await waitForNextUpdate();
        expect(result.current.data).toEqual(true);
    });

    it('should return false if itayose and open markets exist', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useIsGlobalItayose()
        );
        await waitForNextUpdate();
        expect(result.current.data).toEqual(false);
    });

    it('should return false if there are no itayose markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...noItayoseMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useIsGlobalItayose()
        );
        await waitForNextUpdate();
        expect(result.current.data).toEqual(false);
    });
});
