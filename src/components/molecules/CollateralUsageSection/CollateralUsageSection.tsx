import { useMemo } from 'react';
import { getLiquidationInformation } from 'src/components/atoms';
import { CurrencySymbol, formatWithCurrency, percentFormat } from 'src/utils';

export const CollateralUsageSection = ({
    collateralCoverage,
    currency,
    availableToBorrow,
}: {
    collateralCoverage: number;
    currency: CurrencySymbol;
    availableToBorrow: number;
}) => {
    collateralCoverage = collateralCoverage / 100.0;

    const collateralUsagePercent = useMemo(() => {
        return percentFormat(collateralCoverage);
    }, [collateralCoverage]);

    const info = getLiquidationInformation(collateralCoverage);

    return (
        <div className='flex max-w-sm flex-row justify-between'>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-secondary7'>
                    Available to borrow
                </h3>
                <p className='typography-caption font-bold text-white'>
                    {formatWithCurrency(availableToBorrow, currency)}
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
