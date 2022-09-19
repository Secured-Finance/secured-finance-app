import { AssetPrices } from 'src/store/assetPrices';

export const preloadedAssetPrices: { assetPrices: AssetPrices } = {
    assetPrices: {
        FIL: {
            price: 6.0,
            change: -8.208519783216566,
        },
        ETH: {
            price: 2000.34,
            change: 0.5162466489453748,
        },
        USDC: {
            price: 1.0,
            change: 0.042530768538486696,
        },
        WBTC: {
            price: 50000.0,
            change: 0.0,
        },
        isLoading: false,
    },
};
