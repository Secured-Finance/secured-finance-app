import { FilecoinNumber } from '@glif/filecoin-number';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FixedNumber } from 'ethers';

const initialStore: {
    currencyIndex: number;
    currencyShortName: string;
    currencyName: string;
    amount: number;
    gasPrice: number;
    txFee: FixedNumber;
    toAddress: string;
    isLoading: boolean;
    maxTxFee: FilecoinNumber;
} = {
    currencyIndex: 0,
    currencyShortName: 'ETH',
    currencyName: 'Ethereum',
    amount: 0,
    gasPrice: 0,
    txFee: FixedNumber.from('0'),
    toAddress: '',
    isLoading: false,
    maxTxFee: new FilecoinNumber(0, 'attofil'),
};

const sendFormSlice = createSlice({
    name: 'sendForm',
    initialState: initialStore,
    reducers: {
        updateSendTxFee: (state, action: PayloadAction<FixedNumber>) => {
            state.txFee = action.payload;
            state.isLoading = false;
        },
        updateSendGasPrice: (state, action: PayloadAction<number>) => {
            state.gasPrice = action.payload;
            state.isLoading = false;
        },
        setMaxTxFee: (state, action: PayloadAction<FilecoinNumber>) => {
            state.maxTxFee = action.payload;
            state.isLoading = false;
        },
    },
});

export default sendFormSlice;
