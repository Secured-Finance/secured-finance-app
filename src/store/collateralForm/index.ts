import { CollateralFormStore } from "./types";
export type { CollateralFormStore } from "./types"
export { default } from './reducer'
export * from './actions'

export const collateralFormSelector = (state: { collateralForm: CollateralFormStore }) => state.collateralForm