import { RootState } from '../types';

export const selectLastUserActionTimestamp = (state: RootState) =>
    state.blockchain.lastActionTimestamp;
