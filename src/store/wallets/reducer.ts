import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletBase } from '.';
import { defaultEthWallet, defaultFilWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: defaultEthWallet,
    filecoin: defaultFilWallet,
    isLoading: false,
};

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: initialStore,
    reducers: {
        updateEthWalletBalance(state, action: PayloadAction<number>) {
            state.ethereum.balance = action.payload;
            state.isLoading = false;
        },
        updateEthWalletUSDBalance(state, action: PayloadAction<number>) {
            state.ethereum.usdBalance = action.payload;
            state.isLoading = false;
        },
        updateEthWalletAddress(state, action: PayloadAction<string>) {
            state.ethereum.address = action.payload;
            state.isLoading = false;
        },
        updateEthWalletPortfolioShare(state, action: PayloadAction<number>) {
            state.ethereum.portfolioShare = action.payload;
            state.isLoading = false;
        },
        updateEthWalletDailyChange(state, action: PayloadAction<number>) {
            state.ethereum.dailyChange = action.payload;
            state.isLoading = false;
        },
        updateEthWalletAssetPrice(state, action: PayloadAction<number>) {
            state.ethereum.assetPrice = action.payload;
            state.isLoading = false;
        },
        updateEthWalletActions(
            state,
            action: PayloadAction<WalletBase['actions']>
        ) {
            state.ethereum.actions = action.payload;
            state.isLoading = false;
        },
        updateFilWalletBalance(state, action: PayloadAction<number>) {
            state.filecoin.balance = action.payload;
            state.isLoading = false;
        },
        updateFilWalletUSDBalance(state, action: PayloadAction<number>) {
            state.filecoin.usdBalance = action.payload;
            state.isLoading = false;
        },
        updateFilWalletAddress(state, action: PayloadAction<string>) {
            state.filecoin.address = action.payload;
            state.isLoading = false;
        },
        updateFilWalletPortfolioShare(state, action: PayloadAction<number>) {
            state.filecoin.portfolioShare = action.payload;
            state.isLoading = false;
        },
        updateFilWalletDailyChange(state, action: PayloadAction<number>) {
            state.filecoin.dailyChange = action.payload;
            state.isLoading = false;
        },
        updateFilWalletAssetPrice(state, action: PayloadAction<number>) {
            state.filecoin.assetPrice = action.payload;
            state.isLoading = false;
        },
        updateFilWalletActions(
            state,
            action: PayloadAction<WalletBase['actions']>
        ) {
            state.filecoin.actions = action.payload;
            state.isLoading = false;
        },
        updateTotalUSDBalance(state, action: PayloadAction<number>) {
            state.totalUSDBalance = action.payload;
            state.isLoading = false;
        },
        fetchWallet(state) {
            state.isLoading = true;
        },
        fetchWalletFailure(state) {
            state.isLoading = false;
        },
        resetEthWallet(state) {
            state.ethereum = defaultEthWallet;
            state.isLoading = false;
        },
        resetFilWallet(state) {
            state.filecoin = defaultFilWallet;
            state.isLoading = false;
        },
    },
});

export default walletsSlice;
