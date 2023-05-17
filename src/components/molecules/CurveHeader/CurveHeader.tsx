import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CurveHeaderAsset, CurveHeaderTotal } from 'src/components/atoms';
import {
    getPriceChangeMap,
    getPriceMap,
} from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { DailyVolumes } from 'src/types';
import {
    computeTotalDailyVolumeInUSD,
    CurrencySymbol,
    ordinaryFormat,
} from 'src/utils';

interface CurveHeaderProps {
    asset: CurrencySymbol;
    dailyVolumes: DailyVolumes;
}

export const CurveHeader = ({
    asset = CurrencySymbol.EFIL,
    dailyVolumes,
}: CurveHeaderProps): JSX.Element => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const priceChangeList = useSelector((state: RootState) =>
        getPriceChangeMap(state)
    );

    const totalVolume = useMemo(() => {
        const { totalUSD, volumePerCurrency } = computeTotalDailyVolumeInUSD(
            dailyVolumes,
            priceList
        );

        const totalVolumeUSD = ordinaryFormat(totalUSD, 2, 'standard');
        const totalVolumeAsset = ordinaryFormat(volumePerCurrency[asset], 2);

        return { totalVolumeUSD, totalVolumeAsset };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(priceList), dailyVolumes, asset]);

    return (
        <div className='flex h-20 w-[585px] flex-row justify-between p-4'>
            <CurveHeaderAsset
                ccy={asset}
                value={priceList[asset]}
                fluctuation={priceChangeList[asset]}
            ></CurveHeaderAsset>
            <div className='flex flex-row gap-2'>
                <CurveHeaderTotal
                    header='Total Volume (Asset)'
                    footer={`${totalVolume.totalVolumeAsset} ${asset}`}
                />

                <CurveHeaderTotal
                    header='Total Volume (USD)'
                    footer={`$${totalVolume.totalVolumeUSD}`}
                />
            </div>
        </div>
    );
};
