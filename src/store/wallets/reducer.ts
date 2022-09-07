import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultEthWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    totalUSDBalance: 0,
    ethereum: defaultEthWallet,
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
        updateTotalUSDBalance(state, action: PayloadAction<number>) {
            state.totalUSDBalance = action.payload;
        },
        resetEthWallet(state) {
            state.ethereum = defaultEthWallet;
        },
    },
});

export default walletsSlice;
