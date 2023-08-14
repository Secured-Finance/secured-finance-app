import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLiquidationInformation } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, formatWithCurrency, percentFormat } from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';

export const CollateralUsageSection = ({
    usdCollateral,
    collateralCoverage,
    currency,
    collateralThreshold,
}: {
    usdCollateral: CollateralBook['usdCollateral'];
    collateralCoverage: number;
    currency: CurrencySymbol;
    collateralThreshold: number;
}) => {
    collateralCoverage = collateralCoverage / 100.0;
    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const collateralUsagePercent = useMemo(() => {
        return percentFormat(collateralCoverage);
    }, [collateralCoverage]);

    const availableToBorrow = useMemo(() => {
        let result = 0;
        if (currency && assetPriceMap) {
            result = computeAvailableToBorrow(
                assetPriceMap[currency],
                usdCollateral,
                collateralCoverage / 100.0,
                collateralThreshold
            );
        }
        return formatWithCurrency(isNaN(result) ? 0 : result, currency);
    }, [
        assetPriceMap,
        collateralCoverage,
        collateralThreshold,
        currency,
        usdCollateral,
    ]);

    const info = getLiquidationInformation(collateralCoverage);

    return (
        <div className='flex max-w-sm flex-row justify-between'>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-secondary7'>
                    Available to borrow
                </h3>
                <p className='typography-caption font-bold text-white'>
                    {availableToBorrow}
                </p>
            </div>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-secondary7'>
                    Collateral Usage
                </h3>
                <p
                    className={`typography-caption text-right font-bold ${info.color}`}
                >
                    {collateralUsagePercent}
                </p>
            </div>
        </div>
    );
};
