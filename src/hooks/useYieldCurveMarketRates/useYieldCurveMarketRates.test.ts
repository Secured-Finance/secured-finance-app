import { BigNumber } from 'ethers';
import {
    maturitiesMockFromContract,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useYieldCurveMarketRates } from './useYieldCurveMarketRates';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preOrderMarket = {
    name: 'DEC24-1',
    maturity: BigNumber.from(new Maturity(1743011200).toString()),
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
    ...preOrderMarket,
    isPreOrderPeriod: false,
};

const nearMaturityMarket = {
    ...preOrderMarket,
    maturity: BigNumber.from(new Maturity(1638662400).toString()),
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

const closeToMaturity = [
    ...maturitiesMockFromContract(wfilBytes32),
    nearMaturityMarket,
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
        expect(result.current.rates).toHaveLength(9);
        expect(result.current.maturityList).toHaveLength(9);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([8]));
    });

    it('should return correct index set for more than one itayose markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValueOnce([
            ...twoItayoseMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(10);
        expect(result.current.maturityList).toHaveLength(10);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([8, 9]));
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
        expect(result.current.rates).toHaveLength(9);
        expect(result.current.maturityList).toHaveLength(9);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([8]));
    });

    it('should return ZC rates for open markets and FWD rates for pre-open markets', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValue([
            ...twoItayoseMarkets,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.rates).toHaveLength(10);
        expect(result.current.maturityList).toHaveLength(10);
        expect(result.current.itayoseMarketIndexSet).toEqual(new Set([8, 9]));

        const fwdRate = LoanValue.fromPrice(
            preOrderMarket.openingUnitPrice.toNumber(),
            preOrderMarket.maturity.toNumber(),
            preOrderMarket.openingDate.toNumber()
        ).apr;
        expect(result.current.rates[8].toNormalizedNumber()).toEqual(1.9758);
        expect(result.current.rates[9].toNormalizedNumber()).toEqual(
            fwdRate.toNormalizedNumber()
        );
    });

    it('should return MAX_VALUE for maximumRate if no market is near maturity', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.maximumRate).toEqual(Number.MAX_VALUE);
    });

    it('should return correct maximumRate when a market is near maturity', async () => {
        jest.spyOn(mock, 'getOrderBookDetails').mockResolvedValue([
            ...closeToMaturity,
        ]);
        const { result, waitForNextUpdate } = renderHook(() =>
            useYieldCurveMarketRates()
        );
        await waitForNextUpdate();
        expect(result.current.maximumRate).toEqual(34820);
    });
});
