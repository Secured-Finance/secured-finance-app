import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, formatWithCurrency, percentFormat } from 'src/utils';
import { computeAvailableToBorrow, MAX_COVERAGE } from 'src/utils/collateral';

export const CollateralUsageSection = ({
    usdCollateral,
    collateralCoverage,
    currency,
}: {
    usdCollateral: CollateralBook['usdCollateral'];
    collateralCoverage: number;
    currency: CurrencySymbol;
}) => {
    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const collateralUsagePercent = useMemo(() => {
        return percentFormat(collateralCoverage / 100.0);
    }, [collateralCoverage]);

    const availableToBorrow = useMemo(() => {
        let result = 0;
        if (currency && assetPriceMap) {
            result = computeAvailableToBorrow(
                assetPriceMap[currency],
                usdCollateral,
                collateralCoverage / MAX_COVERAGE
            );
        }
        return formatWithCurrency(isNaN(result) ? 0 : result, currency);
    }, [assetPriceMap, collateralCoverage, currency, usdCollateral]);

    return (
        <div className='flex max-w-sm flex-row justify-between'>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-planetaryPurple'>
                    Available to borrow
                </h3>
                <p className='typography-caption ml-1 font-bold text-white'>
                    {availableToBorrow}
                </p>
            </div>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-planetaryPurple'>
                    Collateral Usage
                </h3>
                <p className='typography-caption mr-1 text-right font-bold text-white'>
                    {collateralUsagePercent}
                </p>
            </div>
        </div>
    );
};
