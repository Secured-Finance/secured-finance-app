import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useTradeHistoryDetails } from './useTradeHistoryDetails';

// TODO: check unit tests

const transactions = [
    {
        averagePrice: 9700,
        amount: '10000000000000000000',
    },
    {
        averagePrice: 9800,
        amount: '20000000000000000000',
    },
    {
        averagePrice: 9900,
        amount: '30000000000000000000',
    },
];

const maturity = 1675252800;

describe('useTradeHistoryDetails', () => {
    it('should return correct min, max, sum, and count for non-empty transactions', () => {
        const { result } = renderHook(() =>
            useTradeHistoryDetails(transactions, CurrencySymbol.ETH, maturity)
        );

        expect(result.current.min.price).toBe(97000000);
        expect(result.current.max.price).toBe(99000000);
        expect(result.current.sum.toString()).toBe('60000000000000000000');
        expect(result.current.count).toBe(3);
    });

    it('should return min and max as 0 for empty transactions', () => {
        const { result } = renderHook(() =>
            useTradeHistoryDetails([], CurrencySymbol.ETH, maturity)
        );

        expect(result.current.min.price).toBe(0);
        expect(result.current.max.price).toBe(0);
        expect(result.current.sum.toString()).toBe('0');
        expect(result.current.count).toBe(0);
    });

    it('should handle transactions with large amounts', () => {
        const largeTransactions = [
            {
                averagePrice: 9700,
                amount: '1000000000000000000000000000',
            },
            {
                averagePrice: 9800,
                amount: '2000000000000000000000000000',
            },
        ];

        const { result } = renderHook(() =>
            useTradeHistoryDetails(
                largeTransactions,
                CurrencySymbol.ETH,
                maturity
            )
        );

        expect(result.current.min.price).toBe(97000000);
        expect(result.current.max.price).toBe(98000000);
        expect(result.current.sum.toString()).toBe(
            '3000000000000000000000000000'
        );
        expect(result.current.count).toBe(2);
    });
});
