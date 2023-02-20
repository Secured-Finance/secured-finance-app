import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { DailyVolumes } from 'src/types';
import { hexToString } from 'web3-utils';
import { currencyMap, toCurrencySymbol } from './currencyList';

export function computeTotalDailyVolumeInUSD(
    dailyVolumes: DailyVolumes,
    priceMap: AssetPriceMap
): BigNumber {
    return dailyVolumes.reduce((acc, dailyVolume) => {
        const { currency, volume } = dailyVolume;
        const ccy = toCurrencySymbol(hexToString(currency));
        if (!ccy) {
            return acc;
        }

        return acc.add(
            Math.floor(
                currencyMap[ccy].fromBaseUnit(BigNumber.from(volume)) *
                    priceMap[ccy]
            )
        );
    }, BigNumber.from(0));
}
