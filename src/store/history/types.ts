export interface HistoryStore {
    lendingHistory: Array<HistoryTableData>
    isLoading: boolean
}

export interface HistoryTableData {
    loanId: string,
    lender: string,
    borrower: string,
    side: number,
    rate: number,
    ccy: number,
    asOf: string,
    term: number,
    pv: number,
    amt: number,
    schedule: Array<Schedule>,
    state: number,
    isAvailable: boolean,
}

export interface Schedule {
    amounts: any[]
    end: any
    notices: any
    payments: any
    start: any
}
