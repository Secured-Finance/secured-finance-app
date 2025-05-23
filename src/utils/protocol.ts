import { AssetPriceMap, DailyVolumes, ProtocolVolume } from 'src/types';
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
    totalVolumeUSD: number;
    volumePerCurrency: Record<CurrencySymbol, bigint>;
    volumePerMarket: Record<string, number>;
} {
    const volumePerCurrency = createCurrencyMap<bigint>(ZERO_BI);
    const volumePerMarket: Record<string, number> = {};

    let totalVolumeUSD = 0;

    dailyVolumes.forEach(dailyVolume => {
        const { currency, volume, maturity } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        const marketKey = `${ccy}-${maturity}`;
        if (!ccy || !priceMap[ccy]) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(BigInt(volume));

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];

        volumePerCurrency[ccy] += BigInt(Math.floor(volumeInBaseUnit));
        totalVolumeUSD += valueInUSD;

        if (volumePerMarket[marketKey]) {
            volumePerMarket[marketKey] += valueInUSD;
        } else {
            volumePerMarket[marketKey] = valueInUSD;
        }
    });
    return { totalVolumeUSD, volumePerCurrency, volumePerMarket };
}

export function computeTotalProtocolVolumeInUSD(
    protocolVolume: ProtocolVolume,
    priceMap: AssetPriceMap
): {
    totalVolumeUSD: number;
} {
    let totalVolumeUSD = 0;

    protocolVolume.forEach(vol => {
        const { currency, totalVolume } = vol;
        const ccy = hexToCurrencySymbol(currency);

        if (!ccy || !priceMap[ccy]) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(
            BigInt(totalVolume)
        );

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];
        totalVolumeUSD += valueInUSD;
    });

    return { totalVolumeUSD };
}
