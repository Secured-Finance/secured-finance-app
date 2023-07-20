import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { BigNumber } from 'ethers';
import {
    assetPriceMap,
    dailyVolumes,
    dec22Fixture,
    usdcBytes32,
} from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from './currencyList';
import { computeTotalDailyVolumeInUSD } from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual({
            totalVolumeUSD: BigNumber.from(0),
            volumePerCurrency: {
                [CurrencySymbol.USDC]: BigNumber.from(0),
                [CurrencySymbol.ETH]: BigNumber.from(0),
                [CurrencySymbol.WFIL]: BigNumber.from(0),
                [CurrencySymbol.WBTC]: BigNumber.from(0),
            },
        });
    });

    it('should compute total daily volume in USD', () => {
        dailyVolumes.push({
            id: `${fromBytes32(usdcBytes32)}-1677628800-2023-02-2`,
            currency: usdcBytes32,
            maturity: dec22Fixture,
            day: `2023-02-2`,
            timestamp: dec22Fixture.toString(),
            volume: '30000000',
        });
        expect(
            computeTotalDailyVolumeInUSD(dailyVolumes, assetPriceMap)
        ).toEqual({
            totalVolumeUSD: BigNumber.from(3942030),
            volumePerCurrency: {
                [CurrencySymbol.USDC]: BigNumber.from(30),
                [CurrencySymbol.ETH]: BigNumber.from(0),
                [CurrencySymbol.WFIL]: BigNumber.from(657000),
                [CurrencySymbol.WBTC]: BigNumber.from(0),
            },
        });
    });
});
