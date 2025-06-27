import { Transaction } from 'src/components/organisms';
import { renderHook } from 'src/test-utils';
import { HistoricalDataIntervals } from 'src/types';
import { useTransactionCandleStickData } from './useTransactionCandleStickData';

// Mock the specific functions we need
jest.mock('src/utils', () => ({
    ...jest.requireActual('src/utils'),
    hexToCurrencySymbol: jest.fn().mockReturnValue('ETH'),
    amountFormatterFromBase: {
        ETH: jest.fn((value: bigint) => Number(value) / 1e18),
    },
}));

describe('useTransactionCandleStickData', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should process transaction data and fill missing hour gap', () => {
        jest.spyOn(Date, 'now').mockReturnValue(1625101200000);
        const mockTransactions: Transaction[] = [
            {
                timestamp: '1625097600',
                open: '200000',
                high: '210000',
                low: '190000',
                close: '205000',
                volume: '1000000000000000000',
                currency: '0x123',
                average: '3',
                interval: '3600',
                maturity: '1725397600',
                volumeInFV: '3',
            },
            {
                timestamp: '1625090400',
                open: '195000',
                high: '205000',
                low: '185000',
                close: '200000',
                volume: '2000000000000000000',
                currency: '0x123',
                average: '3',
                interval: '3600',
                maturity: '1725012600',
                volumeInFV: '3',
            },
        ];

        const historicalTradeData = {
            data: { transactionCandleSticks: mockTransactions },
        };
        const selectedTimeScale = HistoricalDataIntervals['1H'];

        const { result } = renderHook(() =>
            useTransactionCandleStickData(
                historicalTradeData,
                selectedTimeScale
            )
        );

        expect(result.current).toEqual([
            {
                time: '1625090400',
                open: 1950,
                high: 2050,
                low: 1850,
                close: 2000,
                vol: 2,
            },
            {
                time: '1625094000',
                open: 2050,
                high: 2050,
                low: 2050,
                close: 2050,
                vol: 0,
            },
            {
                time: '1625097600',
                open: 2000,
                high: 2100,
                low: 1900,
                close: 2050,
                vol: 1,
            },
            {
                time: '1625101200',
                open: 2000,
                high: 2100,
                low: 1900,
                close: 2050,
                vol: 0,
            },
        ]);

        jest.spyOn(Date, 'now').mockRestore();
    });
});
