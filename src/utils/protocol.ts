import { AssetPriceMap, DailyVolumes } from 'src/types';
import { ZERO_BI } from './collateral';
import {
    CurrencySymbol,
    createCurrencyMap,
    currencyMap,
    hexToCurrencySymbol,
} from './currencyList';

export function computeTotalDailyVolumeInUSD(
    dailyVolumes: DailyVolumes,
    priceMap: AssetPriceMap
): {
    totalVolumeUSD: bigint;
    volumePerCurrency: Record<CurrencySymbol, bigint>;
} {
    const volumePerCurrency = createCurrencyMap<bigint>(ZERO_BI);

    let totalVolumeUSD = ZERO_BI;

    dailyVolumes.forEach(dailyVolume => {
        const { currency, volume } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy || !priceMap[ccy]) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(BigInt(volume));

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];
        volumePerCurrency[ccy] += BigInt(Math.floor(volumeInBaseUnit));
        totalVolumeUSD += BigInt(Math.floor(valueInUSD));
    });
    return { totalVolumeUSD, volumePerCurrency };
}
