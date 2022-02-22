import produce from 'immer';
import * as constants from './constants';
import { AssetPrices } from './types';

const initialStore: AssetPrices = {
    ethereum: {
        price: 0,
        change: 0,
    },
    filecoin: {
        price: 0,
        change: 0,
    },
    usdc: {
        price: 0,
        change: 0,
    },
    isLoading: false,
};

const assetPricesReducer = (state = initialStore, action: any) =>
    produce(state, draft => {
        switch (action.type) {
            case constants.FETCHING_ASSET_PRICE:
                draft.isLoading = true;
                break;
            case constants.FETCHING_ASSET_PRICE_FAILURE:
                draft.isLoading = false;
                break;
            case constants.UPDATE_ETHEREUM_USD_PRICE:
                draft.ethereum.price = action.data;
                break;
            case constants.UPDATE_ETHEREUM_USD_CHANGE:
                draft.ethereum.change = action.data;
                break;
            case constants.UPDATE_FILECOIN_USD_PRICE:
                draft.filecoin.price = action.data;
                break;
            case constants.UPDATE_FILECOIN_USD_CHANGE:
                draft.filecoin.change = action.data;
                break;
            case constants.UPDATE_USDC_USD_PRICE:
                draft.usdc.price = action.data;
                break;
            case constants.UPDATE_USDC_USD_CHANGE:
                draft.usdc.change = action.data;
                break;
            default:
                break;
        }
    });

export default assetPricesReducer;
