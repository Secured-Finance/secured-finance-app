import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { DailyVolumes } from 'src/types';
import { ZERO_BI } from './collateral';
import {
    currencyMap,
    CurrencySymbol,
    hexToCurrencySymbol,
} from './currencyList';

export function computeTotalDailyVolumeInUSD(
    dailyVolumes: DailyVolumes,
    priceMap: AssetPriceMap
): {
    totalVolumeUSD: bigint;
    volumePerCurrency: Record<CurrencySymbol, bigint>;
} {
    const volumePerCurrency: Record<CurrencySymbol, bigint> = {
        [CurrencySymbol.ETH]: ZERO_BI,
        [CurrencySymbol.WFIL]: ZERO_BI,
        [CurrencySymbol.USDC]: ZERO_BI,
        [CurrencySymbol.WBTC]: ZERO_BI,
    };

    let totalVolumeUSD = ZERO_BI;

    dailyVolumes.forEach(dailyVolume => {
        const { currency, volume } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(BigInt(volume));

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];
        volumePerCurrency[ccy] += BigInt(Math.floor(volumeInBaseUnit));
        totalVolumeUSD += BigInt(Math.floor(valueInUSD));
    });
    return { totalVolumeUSD, volumePerCurrency };
}
