import sendFormSlice from './reducer';
import { SendFormStore } from './types';
export type { SendFormStore } from './types';
export const { updateSendTxFee, updateSendGasPrice, setMaxTxFee } =
    sendFormSlice.actions;

export default sendFormSlice.reducer;
export const sendFormSelector = (state: { sendForm: SendFormStore }) =>
    state.sendForm;
