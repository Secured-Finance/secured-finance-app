import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletBase } from '.';
import { defaultEthWallet, defaultFilWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: defaultEthWallet,
    filecoin: defaultFilWallet,
};

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: initialStore,
    reducers: {
        updateEthWalletBalance(state, action: PayloadAction<number>) {
            state.ethereum.balance = action.payload;
        },
        updateEthWalletUSDBalance(state, action: PayloadAction<number>) {
            state.ethereum.usdBalance = action.payload;
        },
        connectEthWallet(state, action: PayloadAction<string>) {
            state.ethereum.address = action.payload;
        },
        updateEthWalletPortfolioShare(state, action: PayloadAction<number>) {
            state.ethereum.portfolioShare = action.payload;
        },
        updateEthWalletDailyChange(state, action: PayloadAction<number>) {
            state.ethereum.dailyChange = action.payload;
        },
        updateEthWalletAssetPrice(state, action: PayloadAction<number>) {
            state.ethereum.assetPrice = action.payload;
        },
        updateEthWalletActions(
            state,
            action: PayloadAction<WalletBase['actions']>
        ) {
            state.ethereum.actions = action.payload;
        },
        updateFilWalletBalance(state, action: PayloadAction<number>) {
            state.filecoin.balance = action.payload;
        },
        updateFilWalletUSDBalance(state, action: PayloadAction<number>) {
            state.filecoin.usdBalance = action.payload;
        },
        updateFilWalletAddress(state, action: PayloadAction<string>) {
            state.filecoin.address = action.payload;
        },
        updateFilWalletPortfolioShare(state, action: PayloadAction<number>) {
            state.filecoin.portfolioShare = action.payload;
        },
        updateFilWalletDailyChange(state, action: PayloadAction<number>) {
            state.filecoin.dailyChange = action.payload;
        },
        updateFilWalletAssetPrice(state, action: PayloadAction<number>) {
            state.filecoin.assetPrice = action.payload;
        },
        updateFilWalletActions(
            state,
            action: PayloadAction<WalletBase['actions']>
        ) {
            state.filecoin.actions = action.payload;
        },
        updateTotalUSDBalance(state, action: PayloadAction<number>) {
            state.totalUSDBalance = action.payload;
        },
        resetEthWallet(state) {
            state.ethereum = defaultEthWallet;
        },
        resetFilWallet(state) {
            state.filecoin = defaultFilWallet;
        },
    },
});

export default walletsSlice;
