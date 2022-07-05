import sendFormSlice from './reducer';

export const { updateSendTxFee, updateSendGasPrice, setMaxTxFee } =
    sendFormSlice.actions;

export default sendFormSlice.reducer;
