import { renderHook } from 'src/test-utils';
import { useGraphClientHook } from './useGraphClientHook';
const trade = {
    id: 123,
    orderId: 123,
    buyerAddr: '0x123',
    sellerAddr: '0x123',
    currency: 'ETH',
    side: 1,
    maturity: 1223455,
    rate: 123,
    amount: 123,
    createdAtTimestamp: 112,
    createdAtBlockNumber: 123,
};

import { useTransactionHistory } from '@secured-finance/sf-graph-client';

jest.mock('@secured-finance/sf-graph-client', () => {
    return {
        useTransactionHistory: jest.fn(() => {
            return {
                data: {
                    transactions: [trade],
                },
                error: null,
            };
        }),
    };
});

describe('useGraphClientHook', () => {
    describe('useTradeHistory', () => {
        it('should return the trade history history', () => {
            const { result } = renderHook(() =>
                useGraphClientHook(
                    '0x123',
                    useTransactionHistory,
                    'transactions'
                )
            );
            expect(result.current).toEqual([trade]);
            expect(result.current).toHaveLength(1);
        });

        it('should return an empty array if no account is provided', () => {
            (useTransactionHistory as jest.Mock).mockReturnValueOnce({
                data: null,
                error: null,
            });

            const { result } = renderHook(() =>
                useGraphClientHook(null, useTransactionHistory, 'transactions')
            );
            expect(result.current).toEqual([]);
            expect(result.current).toHaveLength(0);
        });

        it('should write in the console if there is an error in useTransactionHistory', () => {
            const error = 'this is an error in useTransactionHistory';
            (useTransactionHistory as jest.Mock).mockReturnValueOnce({
                data: null,
                error,
            });

            const spy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            renderHook(() =>
                useGraphClientHook(
                    '0x123',
                    useTransactionHistory,
                    'transactions'
                )
            );
            expect(spy).toHaveBeenCalledWith(error);
        });
    });
});
