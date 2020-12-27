import Filecoin from "@glif/filecoin-wallet-provider";

export interface FilWalletProvider {
    walletType: string
    walletProvider: Filecoin
    isLoading: boolean
}