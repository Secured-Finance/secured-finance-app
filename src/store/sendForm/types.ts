import { FilecoinNumber } from '@glif/filecoin-number';
import { FixedNumber } from 'ethers';

export type SendFormStore = {
    currencyIndex: number;
    currencyShortName: string;
    currencyName: string;
    amount: number;
    gasPrice: number;
    txFee: FixedNumber;
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
    txFee: FixedNumber.from('0'),
    toAddress: '',
    isLoading: false,
    maxTxFee: new FilecoinNumber(0, 'attofil'),
} as SendFormStore;
