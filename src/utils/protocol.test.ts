import { fromBytes32 } from '@secured-finance/sf-graph-client';
import {
    assetPriceMap,
    dailyVolumes,
    dec22Fixture,
    usdcBytes32,
    volumePerMarket,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { ProtocolVolume } from 'src/types';
import { ZERO_BI } from './collateral';
import { createCurrencyMap } from './currencyList';
import {
    computeTotalDailyVolumeInUSD,
    computeTotalProtocolVolumeInUSD,
} from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        const expectedVolumes = createCurrencyMap<bigint>(ZERO_BI);

        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual({
            totalVolumeUSD: 0,
            volumePerCurrency: expectedVolumes,
            volumePerMarket: {},
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
        const expectedVolumes = createCurrencyMap<bigint>(ZERO_BI);
        expectedVolumes.USDC = BigInt(30);
        expectedVolumes.WFIL = BigInt(657000);

        expect(
            computeTotalDailyVolumeInUSD(dailyVolumes, assetPriceMap)
        ).toEqual({
            totalVolumeUSD: 3942030,
            volumePerCurrency: expectedVolumes,
            volumePerMarket,
        });
    });
});

describe('computeTotalProtocolVolumeInUSD', () => {
    it('should return 0 if no protocol volumes', () => {
        expect(computeTotalProtocolVolumeInUSD([], assetPriceMap)).toEqual({
            totalVolumeUSD: 0,
        });
    });

    it('should compute total daily volume in USD', () => {
        const volumesByCurrency: ProtocolVolume = [
            {
                currency: usdcBytes32,
                totalVolume: '30000000',
            },
            {
                currency: wfilBytes32,
                totalVolume: '657000000000000000000000',
            },
        ];
        expect(
            computeTotalProtocolVolumeInUSD(volumesByCurrency, assetPriceMap)
        ).toEqual({
            totalVolumeUSD: 3942030,
        });
    });
});
