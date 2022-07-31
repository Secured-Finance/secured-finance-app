import { OrderbookRow } from '@secured-finance/sf-graph-client/dist/hooks/lending-market/common';

export interface LendingTerminalStore {
    market: string;
    selectedCcy: string;
    selectedCcyName: string;
    currencyIndex: number;
    selectedTerms: string;
    termsIndex: number;
    borrowAmount: number;
    borrowRate: number;
    lendRate: number;
    lendAmount: number;
    isLoading: boolean;

    marketRate: number;
    spread: number;

    borrowOrderbook: Array<OrderbookRow>;
    lendOrderbook: Array<OrderbookRow>;

    tradingHistory: Array<TradingHistoryRow>;
}

export interface TradingHistoryRow {
    rate: number;
    side: number;
    amount: number;
    createdAtTimestamp: number;
}
