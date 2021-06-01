import { RootState } from '../types';

export const getGasPrice = (state: RootState) => state.sendForm.gasPrice;

export const getTxFee = (state: RootState) => state.sendForm.txFee;
