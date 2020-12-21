export interface WalletsStore {
    totalUSDBalance: number
    ethereum: WalletBase
    filecoin: WalletBase
    isLoading: boolean
}

export interface WalletBase {
    ccyIndex: number
    address: string
    balance: number
    usdBalance: number
    assetPrice: number
    portfolioShare: number
    dailyChange: number
    actions?: {
        send: () => void
        signOut: () => void
        placeCollateral: () => void
    }
}
