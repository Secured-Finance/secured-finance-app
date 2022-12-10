import { AssetPrices } from 'src/store/assetPrices';
import { Maturity } from 'src/utils/entities';

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
        BTC: {
            price: 50000.0,
            change: 0.0,
        },
        isLoading: false,
    },
};

export const maturityOptions = [
    { label: 'DEC22', value: new Maturity(1669852800) },
    { label: 'MAR23', value: new Maturity(1677628800) },
    { label: 'JUN23', value: new Maturity(1685577600) },
    { label: 'SEP23', value: new Maturity(1693526400) },
    { label: 'DEC23', value: new Maturity(1701388800) },
    { label: 'MAR24', value: new Maturity(1709251200) },
    { label: 'JUN24', value: new Maturity(1717200000) },
    { label: 'SEP24', value: new Maturity(1725148800) },
];
