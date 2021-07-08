import produce from 'immer';
import * as constants from './constants';
import { LendingStore } from './types';

const initialStore: LendingStore = {
    selectedCcy: 'FIL',
    selectedCcyName: 'Filecoin',
    currencyIndex: 1,
    collateralCcy: 'ETH',
    collateralCcyName: 'Ethereum',
    collateralCcyIndex: 0,
    selectedTerms: '3mo',
    termsIndex: 0,
    borrowAmount: 0,
    lendAmount: 0,
    collateralAmount: 0,
    borrowRate: 0,
    lendRate: 0,
    isLoading: false,
};

const lendingReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.UPDATE_SELECTED_CURRENCY:
                draft.selectedCcy = action.data;
                break;
            case constants.UPDATE_SELECTED_CURRENCY_NAME:
                draft.selectedCcyName = action.data;
                break;
            case constants.UPDATE_CURRENCY_INDEX:
                draft.currencyIndex = action.data;
                break;
            case constants.UPDATE_COLLATERAL_CURRENCY:
                draft.collateralCcy = action.data;
                break;
            case constants.UPDATE_COLLATERAL_CURRENCY_NAME:
                draft.collateralCcyName = action.data;
                break;
            case constants.UPDATE_COLLATERAL_CURRENCY_INDEX:
                draft.collateralCcyIndex = action.data;
                break;
            case constants.UPDATE_COLLATERAL_AMOUNT:
                draft.collateralAmount = action.data;
                break;
            case constants.UPDATE_SELECTED_TERMS:
                draft.selectedTerms = action.data;
                break;
            case constants.UPDATE_TERMS_INDEX:
                draft.termsIndex = action.data;
                break;
            case constants.UPDATE_BORROW_AMOUNT:
                draft.borrowAmount = action.data;
                break;
            case constants.UPDATE_BORROW_RATE:
                draft.borrowRate = action.data;
                break;
            case constants.UPDATE_LEND_AMOUNT:
                draft.lendAmount = action.data;
                break;
            case constants.UPDATE_LEND_RATE:
                draft.lendRate = action.data;
                break;
            default:
                break;
        }
    });

export default lendingReducer;
