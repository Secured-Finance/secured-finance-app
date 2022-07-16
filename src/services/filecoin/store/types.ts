import Filecoin from '@glif/filecoin-wallet-provider';

export interface FilWalletProvider {
    walletType: FilecoinWalletType | null;
    walletProvider: Filecoin | null;
    isLoading: boolean;
}

export enum FilecoinWalletType {
    HDWallet = 'HDWallet',
    PKWallet = 'PrivateKeyWallet',
    Ledger = 'Ledger',
}
