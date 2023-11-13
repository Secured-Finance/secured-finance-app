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
    CurrencySymbol,
    computeTotalDailyVolumeInUSD,
    formatWithCurrency,
    usdFormat,
} from 'src/utils';

interface CurveHeaderProps {
    asset: CurrencySymbol;
    dailyVolumes: DailyVolumes;
}

export const CurveHeader = ({
    asset = CurrencySymbol.WFIL,
    dailyVolumes,
}: CurveHeaderProps): JSX.Element => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const priceChangeList = useSelector((state: RootState) =>
        getPriceChangeMap(state)
    );

    const totalVolume = useMemo(() => {
        const { volumePerCurrency } = computeTotalDailyVolumeInUSD(
            dailyVolumes,
            priceList
        );

        return { volumePerCurrency };
    }, [priceList, dailyVolumes]);

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
