import { renderHook } from '@testing-library/react';
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

describe('useYieldCurveMarketRatesHistorical', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('should return empty rates when no lending markets are available', () => {
        (useLendingMarkets as jest.Mock).mockImplementation(() => ({
            data: { ETH: [] },
        }));

        const { result } = renderHook(() =>
            useYieldCurveMarketRatesHistorical()
        );

        const emptyRates = {
            [HistoricalYieldIntervals['30M']]: [],
            [HistoricalYieldIntervals['1H']]: [],
            [HistoricalYieldIntervals['4H']]: [],
            [HistoricalYieldIntervals['1D']]: [],
            [HistoricalYieldIntervals['1W']]: [],
            [HistoricalYieldIntervals['1MTH']]: [],
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
            useYieldCurveMarketRatesHistorical()
        );

        expect(result.current[HistoricalYieldIntervals['30M']]).toEqual([]);
    });
});
