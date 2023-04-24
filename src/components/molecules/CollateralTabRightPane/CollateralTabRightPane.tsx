import { useMemo } from 'react';
import {
    CollateralProgressBar,
    LiquidationProgressBar,
} from 'src/components/molecules';
import { CollateralBook, useCollateralParameters } from 'src/hooks';

interface CollateralTabRightPaneProps {
    account: string | null;
    collateralBook: CollateralBook;
}

export const CollateralTabRightPane = ({
    collateralBook,
    account,
}: CollateralTabRightPaneProps) => {
    const balance = account ? collateralBook.usdCollateral : 0;

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage.toNumber() / 100.0;
    }, [collateralBook]);

    const collateralThreshold = useCollateralParameters();

    return (
        <div
            className='m-4 flex h-full flex-grow flex-col justify-center gap-3'
            data-testid='collateral-tab-right-pane'
        >
            <CollateralProgressBar
                totalCollateralInUSD={balance}
                collateralCoverage={collateralUsagePercent}
                collateralThreshold={collateralThreshold}
            />
            <LiquidationProgressBar
                liquidationPercentage={collateralUsagePercent}
                collateralThreshold={collateralThreshold}
            />
        </div>
    );
};
