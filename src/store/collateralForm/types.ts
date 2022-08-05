import { BigNumber } from 'ethers';

export interface CollateralFormStore {
    currencyIndex: number;
    currencyShortName: string;
    currencyName: string;
    amount: BigNumber;
    txFee: number;
    isLoading: boolean;
    isInitiated: boolean;
    filAddress: string;
    collateralVault: string;
}

export const defaultStore = {
    currencyIndex: 0,
    currencyShortName: 'ETH',
    currencyName: 'Ethereum',
    amount: BigNumber.from(0),
    txFee: 0,
    isLoading: false,
    isInitiated: true,
    filAddress: '',
} as CollateralFormStore;
