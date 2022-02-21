import * as constants from './constants';

// ETH WALLET ACTIONS
export function updateEthWalletBalance(data: number) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_BALANCE,
        data,
    };
}

export function updateEthWalletUSDBalance(data: number) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE,
        data,
    };
}

export function updateEthWalletAddress(data: string) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ADDRESS,
        data,
    };
}

export function updateEthWalletPortfolioShare(data: number) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE,
        data,
    };
}

export function updateEthWalletDailyChange(data: number) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE,
        data,
    };
}

export function updateEthWalletAssetPrice(data: number) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE,
        data,
    };
}

export function updateEthWalletActions(data: object) {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ACTIONS,
        data,
    };
}

// FIL WALLET ACTIONS
export function updateFilWalletBalance(data: number) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_BALANCE,
        data,
    };
}

export function updateFilWalletUSDBalance(data: number) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_USD_BALANCE,
        data,
    };
}

export function updateFilWalletAddress(data: string) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ADDRESS,
        data,
    };
}

export function updateFilWalletPortfolioShare(data: number) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_PORTFOLIO_SHARE,
        data,
    };
}

export function updateFilWalletDailyChange(data: number) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_DAILY_CHANGE,
        data,
    };
}

export function updateFilWalletAssetPrice(data: number) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ASSET_PRICE,
        data,
    };
}

export function updateFilWalletActions(data: object) {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ACTIONS,
        data,
    };
}

// GENERAL ACTIONS
export function updateTotalUSDBalance(data: number) {
    return {
        type: constants.UPDATE_TOTAL_USD_BALANCE,
        data,
    };
}

export function fetchWallet() {
    return {
        type: constants.FETCHING_WALLETS,
    };
}

export function fetchWalletFailure() {
    return {
        type: constants.FETCHING_WALLETS_FAILURE,
    };
}

export function resetEthWallet() {
    return {
        type: constants.RESET_ETHEREUM_WALLET,
    };
}

export function resetFilWallet() {
    return {
        type: constants.RESET_FILECOIN_WALLET,
    };
}
