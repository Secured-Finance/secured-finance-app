import Filecoin from '@glif/filecoin-wallet-provider';

export interface FilWalletProvider {
    walletType: FilecoinWalletType;
    walletProvider: Filecoin;
    isLoading: boolean;
}

export enum FilecoinWalletType {
    HDWallet = 'HDWallet',
    PKWallet = 'PrivateKeyWallet',
    Ledger = 'Ledger',
}
