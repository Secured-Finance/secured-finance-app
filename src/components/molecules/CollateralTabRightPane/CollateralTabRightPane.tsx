import { useMemo } from 'react';
import {
    CollateralProgressBar,
    LiquidationProgressBar,
} from 'src/components/molecules';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import { CollateralBook } from 'src/hooks';

interface CollateralTabRightPaneProps {
    account: string | undefined;
    collateralBook: CollateralBook;
}

export const CollateralTabRightPane = ({
    collateralBook,
    account,
}: CollateralTabRightPaneProps) => {
    const balance = account ? collateralBook.usdCollateral : 0;

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
    }, [collateralBook]);

    return (
        <div
            className='mx-4 hidden h-full flex-grow flex-col justify-center gap-3 tablet:flex'
            data-testid='collateral-tab-right-pane'
        >
            <CollateralProgressBar
                totalCollateralInUSD={balance}
                collateralCoverage={collateralBook.coverage}
                collateralThreshold={collateralBook.collateralThreshold}
                availableToBorrow={collateralBook.usdAvailableToBorrow}
                account={account}
            />
            <LiquidationProgressBar
                liquidationPercentage={collateralUsagePercent}
                collateralThreshold={collateralBook.collateralThreshold}
                account={account}
            />
        </div>
    );
};
