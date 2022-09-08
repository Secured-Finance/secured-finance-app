import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultEthWallet, WalletsStore } from './types';

const initialStore: WalletsStore = {
    ...defaultEthWallet,
};

const walletsSlice = createSlice({
    name: 'wallets',
    initialState: initialStore,
    reducers: {
        updateEthWalletBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        updateEthWalletUSDBalance(state, action: PayloadAction<number>) {
            state.usdBalance = action.payload;
        },
        connectEthWallet(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        updateEthWalletPortfolioShare(state, action: PayloadAction<number>) {
            state.portfolioShare = action.payload;
        },
        updateEthWalletDailyChange(state, action: PayloadAction<number>) {
            state.dailyChange = action.payload;
        },
        updateEthWalletAssetPrice(state, action: PayloadAction<number>) {
            state.assetPrice = action.payload;
        },
        resetEthWallet(state) {
            state = defaultEthWallet;
        },
    },
});

export default walletsSlice;
