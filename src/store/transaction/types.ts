export type TransactionStore = {
    hash: string;
    status: TransactionStatus | null;
    settlementHash: string;
    error: string | null;
};

export enum TransactionStatus {
    Created = 'Created',
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Settled = 'Settled',
    Error = 'Error',
}
