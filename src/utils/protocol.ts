import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { DailyVolumes } from 'src/types';
import {
    amountFormatterToBase,
    currencyMap,
    CurrencySymbol,
    hexToCurrencySymbol,
} from './currencyList';

export function computeTotalDailyVolumeInUSD(
    dailyVolumes: DailyVolumes,
    priceMap: AssetPriceMap
): {
    totalUSD: BigNumber;
    individualVolumes: Record<CurrencySymbol, BigNumber>;
} {
    const individualVolumes: Record<CurrencySymbol, BigNumber> = {
        [CurrencySymbol.ETH]: BigNumber.from(0),
        [CurrencySymbol.EFIL]: BigNumber.from(0),
        [CurrencySymbol.USDC]: BigNumber.from(0),
        [CurrencySymbol.WBTC]: BigNumber.from(0),
    };

    const totalUSD = dailyVolumes.reduce((acc, dailyVolume) => {
        const { currency, volume } = dailyVolume;
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) {
            return acc;
        }

        const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(
            BigNumber.from(volume)
        );
        const valueInUSD = volumeInBaseUnit * priceMap[ccy];

        individualVolumes[ccy] = individualVolumes[ccy]
            ? individualVolumes[ccy].add(Math.floor(volumeInBaseUnit))
            : amountFormatterToBase[ccy](volumeInBaseUnit);

        return acc.add(Math.floor(valueInUSD));
    }, BigNumber.from(0));
    return { totalUSD, individualVolumes };
}
