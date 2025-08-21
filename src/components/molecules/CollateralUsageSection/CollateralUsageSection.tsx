import { useMemo } from 'react';
import { getLiquidationInformation } from 'src/components/atoms';
import {
    amountFormatterFromBase,
    CurrencySymbol,
    PriceFormatter,
} from 'src/utils';

export const CollateralUsageSection = ({
    collateralCoverage,
    currency,
    availableToBorrow,
}: {
    collateralCoverage: number;
    currency: CurrencySymbol;
    availableToBorrow: bigint;
}) => {
    collateralCoverage = collateralCoverage / 100.0;

    const collateralUsagePercent = useMemo(() => {
        return PriceFormatter.formatPercentage(collateralCoverage);
    }, [collateralCoverage]);

    const info = getLiquidationInformation(collateralCoverage);

    return (
        <div className='flex max-w-sm flex-row justify-between'>
            <div className='flex-col'>
                <h3 className='typography-caption-2 text-secondary7'>
                    Available to borrow
                </h3>
                <p className='typography-caption font-bold text-white'>
                    {PriceFormatter.formatWithCurrency(
                        amountFormatterFromBase[currency](availableToBorrow),
                        currency
                    )}
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
