import { CurrencySymbol } from 'src/utils';

export type RecentTradesTableProps = {
    currency: CurrencySymbol;
    maturity: number;
};

export type TradeMetadata = {
    side: number;
    executionPrice: string;
    amount: string;
    createdAt: string;
    txHash: string;
};
