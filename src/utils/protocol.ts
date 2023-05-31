import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { DailyVolumes } from 'src/types';
import {
    currencyMap,
    CurrencySymbol,
    hexToCurrencySymbol,
} from './currencyList';

export function computeTotalDailyVolumeInUSD(
    dailyVolumes: DailyVolumes,
    priceMap: AssetPriceMap
): {
    totalVolumeUSD: BigNumber;
    volumePerCurrency: Record<CurrencySymbol, BigNumber>;
} {
    const volumePerCurrency: Record<CurrencySymbol, BigNumber> = {
        [CurrencySymbol.ETH]: BigNumber.from(0),
        [CurrencySymbol.EFIL]: BigNumber.from(0),
        [CurrencySymbol.USDC]: BigNumber.from(0),
        [CurrencySymbol.WBTC]: BigNumber.from(0),
    };

    let totalVolumeUSD = BigNumber.from(0);

    dailyVolumes.forEach(dailyVolume => {
        const { currency, volume } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) {
            return;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(
            BigNumber.from(volume)
        );

        const valueInUSD = volumeInBaseUnit * priceMap[ccy];

        volumePerCurrency[ccy] = volumePerCurrency[ccy].add(
            Math.floor(volumeInBaseUnit)
        );

        totalVolumeUSD = totalVolumeUSD.add(Math.floor(valueInUSD));
    });
    return { totalVolumeUSD, volumePerCurrency };
}
