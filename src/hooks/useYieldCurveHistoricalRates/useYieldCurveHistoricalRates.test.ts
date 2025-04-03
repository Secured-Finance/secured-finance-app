import { renderHook } from '@testing-library/react';
import { MaturityListItem } from 'src/components/organisms';
import { HistoricalYieldIntervals } from 'src/types';
import { Rate } from 'src/utils';
import { useLendingMarkets } from '../useLendingMarkets';
import { useYieldCurveMarketRatesHistorical } from './index';

jest.mock('src/utils/entities', () => ({
    Maturity: jest.fn().mockImplementation(value => ({
        toNumber: () => Number(value),
        toString: () => String(value),
        equals: () => false,
        isZero: () => value === 0,
    })),
    LoanValue: {
        fromPrice: jest.fn(price => new Rate(price / 1000)),
    },
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(() => ({ currency: 'ETH' })),
}));

jest.mock('../useLendingMarkets', () => ({
    useLendingMarkets: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
    ...jest.requireActual('@apollo/client'),
    useQuery: jest.fn().mockImplementation(() => ({
        data: {
            tx0_0: [{ executionPrice: 1500 }],
            tx0_1: [{ executionPrice: 1800 }],
            tx0_2: [{ executionPrice: 2800 }],
        },
        loading: false,
    })),
}));

const maturityList: MaturityListItem[] = [
    {
        label: 'APR2025',
        maturity: 1743724800,
        isPreOrderPeriod: false,
    },
    {
        label: 'MAY2025',
        maturity: 1746144000,
        isPreOrderPeriod: false,
    },
    {
        label: 'JUN2025',
        maturity: 1748563200,
        isPreOrderPeriod: true,
    },
];

describe('useYieldCurveMarketRatesHistorical', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it.skip('should return empty rates when no lending markets are available', () => {
        (useLendingMarkets as jest.Mock).mockImplementation(() => ({
            data: { ETH: [] },
        }));

        const { result } = renderHook(() =>
            useYieldCurveMarketRatesHistorical(maturityList, 'USDC')
        );

        const emptyRates = {
            [HistoricalYieldIntervals['30M']]: [0],
            [HistoricalYieldIntervals['1H']]: [0],
            [HistoricalYieldIntervals['4H']]: [0],
            [HistoricalYieldIntervals['1D']]: [0],
            [HistoricalYieldIntervals['1W']]: [0],
            [HistoricalYieldIntervals['1MTH']]: [0],
        };

        expect(result.current).toEqual(emptyRates);
    });

    it('should correctly handle maturities past 7 days for maximumRate logic', () => {
        const mockLendingMarkets = {
            data: {
                ETH: [
                    {
                        name: 'Market Expired',
                        maturity: Date.now() - 86400 * 8,
                        isOpened: true,
                        marketUnitPrice: 1000,
                        openingUnitPrice: 1200,
                        utcOpeningDate: Date.now() - 86400,
                    },
                ],
            },
        };

        (useLendingMarkets as jest.Mock).mockImplementation(
            () => mockLendingMarkets
        );

        const { result } = renderHook(() =>
            useYieldCurveMarketRatesHistorical(maturityList, 'USDC')
        );

        expect(
            result.current.historicalRates[HistoricalYieldIntervals['30M']]
        ).toEqual([]);
    });
});
