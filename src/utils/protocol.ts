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
    volumePerMarket: Record<string, bigint>;
} {
    const volumePerCurrency = createCurrencyMap<bigint>(ZERO_BI);
    const volumePerMarket: Record<string, bigint> = {};

    let totalVolumeUSD = ZERO_BI;

    dailyVolumes.forEach(dailyVolume => {
        const { currency, volume, maturity } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        const marketKey = `${ccy}-${maturity}`;
        if (!ccy || !priceMap[ccy]) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(BigInt(volume));

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];
        const valueInUSDInteger = BigInt(Math.floor(valueInUSD));

        volumePerCurrency[ccy] += BigInt(Math.floor(volumeInBaseUnit));
        totalVolumeUSD += valueInUSDInteger;

        if (volumePerMarket[marketKey]) {
            volumePerMarket[marketKey] += valueInUSDInteger;
        } else {
            volumePerMarket[marketKey] = valueInUSDInteger;
        }
    });
    return { totalVolumeUSD, volumePerCurrency, volumePerMarket };
}
