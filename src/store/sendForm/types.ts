import { FilecoinNumber } from '@glif/filecoin-number';

export type SendFormStore = {
    currencyIndex: number;
    currencyShortName: string;
    currencyName: string;
    amount: number;
    gasPrice: number;
    txFee: number;
    toAddress: string;
    isLoading: boolean;
    maxTxFee: FilecoinNumber;
};

export const defaultStore = {
    currencyIndex: 0,
    currencyShortName: 'ETH',
    currencyName: 'Ethereum',
    amount: 0,
    gasPrice: 0,
    txFee: 0,
    toAddress: '',
    isLoading: false,
    maxTxFee: new FilecoinNumber(0, 'attofil'),
} as SendFormStore;
