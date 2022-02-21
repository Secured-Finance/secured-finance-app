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

export interface OrderbookRow {
    rate: number;
    totalAmount: number;
    usdAmount: number;
}

export interface TradingHistoryRow {
    rate: number;
    side: number;
    amount: number;
    createdAtTimestamp: number;
}
