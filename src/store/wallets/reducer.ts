import * as constants from './constants';
import { defaultEthWallet, defaultFilWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: defaultEthWallet,
    filecoin: defaultFilWallet,
    isLoading: false,
};

export default (
    state = initialStore,
    action: { type: string; data: any; error: string }
) => {
    switch (action.type) {
        case constants.FETCHING_WALLETS:
            return {
                ...state,
                isLoading: true,
            };
        case constants.FETCHING_WALLETS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        case constants.UPDATE_TOTAL_USD_BALANCE:
            return {
                ...state,
                totalUSDBalance: action.data,
            };

        // Ethereum
        case constants.UPDATE_ETHEREUM_WALLET_ADDRESS:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    address: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_BALANCE:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    balance: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    usdBalance: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    assetPrice: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    portfolioShare: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    dailyChange: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_ETHEREUM_WALLET_ACTIONS:
            return {
                ...state,
                ethereum: {
                    ...state.ethereum,
                    actions: action.data,
                },
                isLoading: false,
            };
        case constants.RESET_ETHEREUM_WALLET:
            return {
                ...state,
                ethereum: defaultEthWallet,
                isLoading: false,
            };

        // Filecoin
        case constants.UPDATE_FILECOIN_WALLET_ADDRESS:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    address: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_BALANCE:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    balance: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_USD_BALANCE:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    usdBalance: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_ASSET_PRICE:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    assetPrice: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_PORTFOLIO_SHARE:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    portfolioShare: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_DAILY_CHANGE:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    dailyChange: action.data,
                },
                isLoading: false,
            };
        case constants.UPDATE_FILECOIN_WALLET_ACTIONS:
            return {
                ...state,
                filecoin: {
                    ...state.filecoin,
                    actions: action.data,
                },
                isLoading: false,
            };
        case constants.RESET_FILECOIN_WALLET:
            return {
                ...state,
                filecoin: defaultFilWallet,
                isLoading: false,
            };
        default:
            return state;
    }
};
