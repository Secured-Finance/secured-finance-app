import * as constants from './constants';
import { WalletAction } from './types';

// ETH WALLET ACTIONS
export function updateEthWalletBalance(data: number): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_BALANCE,
        data,
    };
}

export function updateEthWalletUSDBalance(data: number): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_USD_BALANCE,
        data,
    };
}

export function updateEthWalletAddress(data: string): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ADDRESS,
        data,
    };
}

export function updateEthWalletPortfolioShare(data: number): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_PORTFOLIO_SHARE,
        data,
    };
}

export function updateEthWalletDailyChange(data: number): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_DAILY_CHANGE,
        data,
    };
}

export function updateEthWalletAssetPrice(data: number): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ASSET_PRICE,
        data,
    };
}

export function updateEthWalletActions(
    data: Record<string, unknown>
): WalletAction {
    return {
        type: constants.UPDATE_ETHEREUM_WALLET_ACTIONS,
        data,
    };
}

// FIL WALLET ACTIONS
export function updateFilWalletBalance(data: number): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_BALANCE,
        data,
    };
}

export function updateFilWalletUSDBalance(data: number): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_USD_BALANCE,
        data,
    };
}

export function updateFilWalletAddress(data: string): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ADDRESS,
        data,
    };
}

export function updateFilWalletPortfolioShare(data: number): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_PORTFOLIO_SHARE,
        data,
    };
}

export function updateFilWalletDailyChange(data: number): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_DAILY_CHANGE,
        data,
    };
}

export function updateFilWalletAssetPrice(data: number): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ASSET_PRICE,
        data,
    };
}

export function updateFilWalletActions(
    data: Record<string, unknown>
): WalletAction {
    return {
        type: constants.UPDATE_FILECOIN_WALLET_ACTIONS,
        data,
    };
}

// GENERAL ACTIONS
export function updateTotalUSDBalance(data: number): WalletAction {
    return {
        type: constants.UPDATE_TOTAL_USD_BALANCE,
        data,
    };
}

export function fetchWallet(): WalletAction {
    return {
        type: constants.FETCHING_WALLETS,
    };
}

export function fetchWalletFailure(): WalletAction {
    return {
        type: constants.FETCHING_WALLETS_FAILURE,
    };
}

export function resetEthWallet(): WalletAction {
    return {
        type: constants.RESET_ETHEREUM_WALLET,
    };
}

export function resetFilWallet(): WalletAction {
    return {
        type: constants.RESET_FILECOIN_WALLET,
    };
}
