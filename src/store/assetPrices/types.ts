export interface AssetPrice {
    price: number
    change: number
}

export interface AssetPrices {
    ethereum: AssetPrice
    filecoin: AssetPrice
    usdc: AssetPrice
    isLoading: boolean
}