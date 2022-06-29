import { Currency } from '@secured-finance/sf-graph-client/dist/.graphclient';

export interface HistoryStore {
    lendingHistory: Array<HistoryTableData>;
    borrowingHistory: Array<HistoryTableData>;
}

export interface HistoryTableData {
    id: string;
    lender: string;
    borrower: string;
    rate: string;
    currency: Currency;
    term: string;
    presentValue: string;
    notional: string;
    couponPayment: string;
    state: number;
    startTimestamp: string;
    endTimestamp: string;
}
