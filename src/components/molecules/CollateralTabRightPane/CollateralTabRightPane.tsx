import { useMemo } from 'react';
import {
    CollateralProgressBar,
    LiquidationProgressBar,
} from 'src/components/molecules';
import { CollateralBook } from 'src/hooks';

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

    return (
        <div
            className='m-9 flex flex-grow flex-col justify-center gap-20'
            data-testid='collateral-tab-right-pane'
        >
            <CollateralProgressBar
                totalCollateralInUSD={balance}
                collateralCoverage={collateralUsagePercent}
            />
            <LiquidationProgressBar
                liquidationPercentage={collateralUsagePercent}
            />
        </div>
    );
};
