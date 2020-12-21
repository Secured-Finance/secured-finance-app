export interface LendingStore {
    selectedCcy: string
    selectedCcyName: string
    currencyIndex: number
    collateralCcy: string
    collateralCcyName: string
    collateralCcyIndex: number
    selectedTerms: string
    termsIndex: number
    borrowAmount: number
    collateralAmount: number
    isLoading: boolean
    borrowRate: number
    lendRate: number
    lendAmount: number
}