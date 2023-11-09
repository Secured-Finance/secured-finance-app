import { fromBytes32 } from '@secured-finance/sf-graph-client';
import {
    assetPriceMap,
    dailyVolumes,
    dec22Fixture,
    usdcBytes32,
} from 'src/stories/mocks/fixtures';
import { ZERO_BI } from './collateral';
import { CurrencySymbol } from './currencyList';
import { computeTotalDailyVolumeInUSD } from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual({
            totalVolumeUSD: ZERO_BI,
            volumePerCurrency: {
                [CurrencySymbol.USDC]: ZERO_BI,
                [CurrencySymbol.ETH]: ZERO_BI,
                [CurrencySymbol.WFIL]: ZERO_BI,
                [CurrencySymbol.WBTC]: ZERO_BI,
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
            totalVolumeUSD: BigInt(3942030),
            volumePerCurrency: {
                [CurrencySymbol.USDC]: BigInt(30),
                [CurrencySymbol.ETH]: ZERO_BI,
                [CurrencySymbol.WFIL]: BigInt(657000),
                [CurrencySymbol.WBTC]: ZERO_BI,
            },
        });
    });
});
