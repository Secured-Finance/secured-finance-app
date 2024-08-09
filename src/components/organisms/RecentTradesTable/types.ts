import { CurrencySymbol } from 'src/utils';

export type RecentTradesTableProps = {
    currency: CurrencySymbol;
    maturity: number;
};

export type TradeMetadata = {
    side: number;
    averagePrice: number;
    amount: string;
    createdAt: string;
    // TODO: add txHash
};
