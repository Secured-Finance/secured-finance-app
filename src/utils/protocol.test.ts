import { BigNumber } from 'ethers';
import { assetPriceMap, dailyVolumes } from 'src/stories/mocks/fixtures';
import { computeTotalDailyVolumeInUSD } from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual(
            BigNumber.from(0)
        );
    });

    it('should compute total daily volume in USD', () => {
        expect(
            computeTotalDailyVolumeInUSD(dailyVolumes, assetPriceMap).toString()
        ).toEqual('3942000');
    });
});
