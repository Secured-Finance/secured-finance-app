import Filecoin from '@glif/filecoin-wallet-provider';
import { FileCoinActionType } from './constants';

export interface FilWalletProvider {
    walletType: string;
    walletProvider: Filecoin;
    isLoading: boolean;
}

export type FilWalletProviderAction = {
    type: FileCoinActionType;
    data?: unknown;
};
