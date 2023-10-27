import { BigNumber } from 'ethers';
import {
    maturitiesMockFromContract,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { Maturity } from 'src/utils/entities';
import { useYieldCurveMarketRates } from './useYieldCurveMarketRates';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const itayoseFixture = new Maturity(1743011200);

const preOrderMarket = {
    name: 'DEC24-1',
    maturity: BigNumber.from(itayoseFixture.toString()),
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
    ccy: wfilBytes32,
};

const closedMarket = {
    name: 'DEC24-1',
    maturity: BigNumber.from(itayoseFixture.toString()),
    openingDate: BigNumber.from('1685587600'),
    marketUnitPrice: BigNumber.from('9001'),
    openingUnitPrice: BigNumber.from('9710'),
    isReady: false,
    isOpened: false,
    isMatured: false,
    isPreOrderPeriod: false,
    isItayosePeriod: false,
    bestBorrowUnitPrice: BigNumber.from('9615'),
    bestLendUnitPrice: BigNumber.from('9617'),
    minBorrowUnitPrice: BigNumber.from('9602'),
    maxLendUnitPrice: BigNumber.from('9630'),
    ccy: wfilBytes32,
};

const noItayoseMarkets = maturitiesMockFromContract(wfilBytes32).slice(0, 8);

const twoItayoseMarkets = [
    ...maturitiesMockFromContract(wfilBytes32),
    preOrderMarket,
];

const closedMarkets = [
    ...maturitiesMockFromContract(wfilBytes32),
    closedMarket,
];

describe('useYieldCurveMarketRates', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return empty index set for no itayose market', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...noItayoseMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );

        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(8);
        expect(result.current.maturityList).toHaveLength(8);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set());
    });

    it('should return correct itayose index for default mocks', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );

        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(8);
        expect(result.current.maturityList).toHaveLength(8);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([7]));
    });

    it('should return correct index set for more than one itayose markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...twoItayoseMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(9);
        expect(result.current.maturityList).toHaveLength(9);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([7, 8]));
    });

    it('should return empty lists for no markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValue([]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(0);
        expect(result.current.maturityList).toHaveLength(0);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set());
    });

    it('should not return matured or markets not in pre-open or itayose mode', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValue([
            ...closedMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(8);
        expect(result.current.maturityList).toHaveLength(8);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([7]));
    });
});
