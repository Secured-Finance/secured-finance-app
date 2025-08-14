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
    dailyVolumes?: DailyVolumes;
}

const CurveHeaderNotes = ({
    asset = CurrencySymbol.USDC,
    priceList,
    dailyVolumes,
}: {
    asset: CurrencySymbol;
    priceList: AssetPriceMap;
    dailyVolumes: DailyVolumes;
}) => {
    const totalVolume = useMemo(() => {
        const { volumePerCurrency } = computeTotalDailyVolumeInUSD(
            dailyVolumes,
            priceList,
        );

        return { volumePerCurrency };
    }, [priceList, dailyVolumes]);

    return (
        <div className='flex flex-row gap-2'>
            <CurveHeaderTotal
                header='Total Volume (Asset)'
                footer={formatWithCurrency(
                    totalVolume.volumePerCurrency[asset],
                    asset.toString(),
                )}
            />

            <CurveHeaderTotal
                header='Total Volume (USD)'
                footer={usdFormat(
                    Number(totalVolume.volumePerCurrency[asset]) *
                        priceList[asset],
                )}
            />
        </div>
    );
};
export const CurveHeader = ({
    asset = CurrencySymbol.USDC,
    priceList,
    dailyVolumes,
}: CurveHeaderProps): JSX.Element => {
    return (
        <div className='flex h-20 w-[585px] flex-row justify-between p-4'>
            <CurveHeaderAsset
                ccy={asset}
                value={priceList[asset]}
            ></CurveHeaderAsset>
            {dailyVolumes && (
                <CurveHeaderNotes
                    asset={asset}
                    priceList={priceList}
                    dailyVolumes={dailyVolumes}
                />
            )}
        </div>
    );
};
