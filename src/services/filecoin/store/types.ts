import Filecoin from '@glif/filecoin-wallet-provider';
import { FileCoinActionType } from './constants';

export interface FilWalletProvider {
    walletType: FilecoinWalletType;
    walletProvider: Filecoin;
    isLoading: boolean;
}

export type FilWalletProviderAction = {
    type: FileCoinActionType;
    data?: unknown;
};

export enum FilecoinWalletType {
    HDWallet = 'HDWallet',
    PKWallet = 'PrivateKeyWallet',
    Ledger = 'Ledger',
}
