export interface SendFormStore {
    currencyIndex: number
    currencyShortName: string
    currencyName: string
    amount: number
    gasPrice: number
    txFee: number
    toAddress: string
    isLoading: boolean
}

export const defaultStore = {
    currencyIndex: 0,
    currencyShortName: "ETH",
    currencyName: "Ethereum",
    amount: 0, 
    gasPrice: 0,
    txFee: 0,
    toAddress: '',
    isLoading: false,
} as SendFormStore