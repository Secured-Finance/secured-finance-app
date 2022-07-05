import collateralFormSlice from './reducer';
import { CollateralFormStore } from './types';
export type { CollateralFormStore } from './types';

export const collateralFormSelector = (state: {
    collateralForm: CollateralFormStore;
}) => state.collateralForm;

export const {
    updateCollateralCcyIndex,
    updateCollateralCcyShortName,
    updateCollateralCcyName,
    updateCollateralAmount,
    updateCollateralTxFee,
    fetchCollateralStore,
    fetchCollateralStoreFailure,
    updateCollateralCurrency,
} = collateralFormSlice.actions;

export default collateralFormSlice.reducer;
