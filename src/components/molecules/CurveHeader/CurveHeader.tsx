import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CurveHeaderAsset, CurveHeaderTotal } from 'src/components/atoms';
import { useGraphClientHook } from 'src/hooks';
import {
    getPriceChangeMap,
    getPriceMap,
} from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    computeTotalDailyVolumeInUSD,
    CurrencySymbol,
    ordinaryFormat,
} from 'src/utils';

interface CurveHeaderProps {
    asset: CurrencySymbol;
}

export const CurveHeader = ({
    asset = CurrencySymbol.EFIL,
}: CurveHeaderProps): JSX.Element => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const priceChangeList = useSelector((state: RootState) =>
        getPriceChangeMap(state)
    );

    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes',
        false
    );
    const totalVolume = useMemo(() => {
        const { totalUSD, individualVolumes } = computeTotalDailyVolumeInUSD(
            dailyVolumes.data ?? [],
            priceList
        );

        const totalVolumeUSD = ordinaryFormat(totalUSD, 2, 'standard');
        const totalVolumeAsset = ordinaryFormat(individualVolumes.EFIL, 2);

        return { totalVolumeUSD, totalVolumeAsset };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(priceList), dailyVolumes.data]);

    return (
        <div className='flex h-20 w-[585px] flex-row justify-between p-4'>
            <CurveHeaderAsset
                ccy={asset}
                value={priceList[asset]}
                fluctuation={priceChangeList[asset]}
            ></CurveHeaderAsset>
            <div className='flex flex-row gap-2'>
                <CurveHeaderTotal
                    header='Total Volume(Asset)'
                    footer={totalVolume.totalVolumeAsset}
                />

                <CurveHeaderTotal
                    header='Total Volume(USD)'
                    footer={totalVolume.totalVolumeUSD}
                />
            </div>
        </div>
    );
};
