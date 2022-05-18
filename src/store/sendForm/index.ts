import sendFormSlice from './reducer';
import { SendFormStore } from './types';
export type { SendFormStore } from './types';
export const {
    updateSendCurrency,
    updateSendCcyIndex,
    updateSendCcyName,
    updateSendCcyShortName,
    updateSendAmount,
    updateSendToAddress,
    updateSendTxFee,
    updateSendGasPrice,
    resetSendForm,
    fetchSendStore,
    fetchSendStoreFailure,
    setMaxTxFee,
} = sendFormSlice.actions;

export default sendFormSlice.reducer;
export const sendFormSelector = (state: { sendForm: SendFormStore }) =>
    state.sendForm;
