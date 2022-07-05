import { errorSlice } from './reducer';

export const { setLastMessage, clearLastMessage } = errorSlice.actions;
export default errorSlice.reducer;
