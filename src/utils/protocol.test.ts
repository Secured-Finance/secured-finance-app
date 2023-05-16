import { BigNumber } from 'ethers';
import { assetPriceMap, dailyVolumes } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from './currencyList';
import { computeTotalDailyVolumeInUSD } from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual({
            totalUSD: BigNumber.from(0),
            individualVolumes: {
                [CurrencySymbol.USDC]: BigNumber.from(0),
                [CurrencySymbol.ETH]: BigNumber.from(0),
                [CurrencySymbol.EFIL]: BigNumber.from(0),
                [CurrencySymbol.WBTC]: BigNumber.from(0),
            },
        });
    });

    it('should compute total daily volume in USD', () => {
        expect(
            computeTotalDailyVolumeInUSD(dailyVolumes, assetPriceMap)
        ).toEqual({
            totalUSD: BigNumber.from(3942000),
            individualVolumes: {
                [CurrencySymbol.USDC]: BigNumber.from(0),
                [CurrencySymbol.ETH]: BigNumber.from(0),
                [CurrencySymbol.EFIL]: BigNumber.from(657000),
                [CurrencySymbol.WBTC]: BigNumber.from(0),
            },
        });
    });
});
