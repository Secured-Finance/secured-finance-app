import { useMemo } from 'react';
import { CurveHeaderAsset, CurveHeaderTotal } from 'src/components/atoms';
import { AssetPriceMap, DailyVolumes } from 'src/types';
import {
    CurrencySymbol,
    computeTotalDailyVolumeInUSD,
    formatWithCurrency,
    usdFormat,
} from 'src/utils';

interface CurveHeaderProps {
    asset: CurrencySymbol;
    priceList: AssetPriceMap;
    dailyVolumes: DailyVolumes;
}

export const CurveHeader = ({
    asset = CurrencySymbol.WBTC,
    priceList,
    dailyVolumes,
}: CurveHeaderProps): JSX.Element => {
    const totalVolume = useMemo(() => {
        const { volumePerCurrency } = computeTotalDailyVolumeInUSD(
            dailyVolumes,
            priceList
        );

        return { volumePerCurrency };
    }, [priceList, dailyVolumes]);

    return (
        <div className='w-[585px] flex h-20 flex-row justify-between p-4'>
            <CurveHeaderAsset
                ccy={asset}
                value={priceList[asset]}
            ></CurveHeaderAsset>
            <div className='flex flex-row gap-2'>
                <CurveHeaderTotal
                    header='Total Volume (Asset)'
                    footer={formatWithCurrency(
                        totalVolume.volumePerCurrency[asset],
                        asset.toString()
                    )}
                />

                <CurveHeaderTotal
                    header='Total Volume (USD)'
                    footer={usdFormat(
                        Number(totalVolume.volumePerCurrency[asset]) *
                            priceList[asset]
                    )}
                />
            </div>
        </div>
    );
};
