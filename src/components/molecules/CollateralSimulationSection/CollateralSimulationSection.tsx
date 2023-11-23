import { useMemo } from 'react';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { CollateralBook, useOrderEstimation } from 'src/hooks';
import { formatCollateralRatio, usdFormat } from 'src/utils';
import { MAX_COVERAGE, computeAvailableToBorrow } from 'src/utils/collateral';
import { useAccount } from 'wagmi';

const CollateralUsageItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='typography-caption text-planetaryPurple'>
                Collateral Usage
            </div>
            <InfoToolTip>
                Existing open orders are factored into your collateral usage and
                may affect remaining borrow capacity
            </InfoToolTip>
        </div>
    );
};

export const CollateralSimulationSection = ({
    collateral,
}: {
    collateral: CollateralBook;
}) => {
    const { address } = useAccount();

    const { data: coverage = 0 } = useOrderEstimation(address);

    const remainingToBorrowText = useMemo(
        () =>
            usdFormat(
                computeAvailableToBorrow(
                    1,
                    collateral.usdCollateral,
                    coverage / MAX_COVERAGE,
                    collateral.collateralThreshold
                ),
                2
            ),
        [collateral.usdCollateral, collateral.collateralThreshold, coverage]
    );

    const items: [string | React.ReactNode, string | React.ReactNode][] = [
        ['Borrow Remaining', remainingToBorrowText],
        [
            <CollateralUsageItem key={1} />,
            getCollateralUsage(collateral.coverage, coverage),
        ],
    ];

    return <SectionWithItems itemList={items} />;
};

const getCollateralUsage = (initial: number, final: number) => {
    const initialColor = getLiquidationInformation(initial / 100).color;
    const finalColor = getLiquidationInformation(final / 100).color;
    return (
        <div className='flex flex-row gap-1'>
            <span className={`${initialColor}`}>
                {formatCollateralRatio(initial)}
            </span>
            <span className='text-neutral-8'>&#8594;</span>
            <span className={`${finalColor}`}>
                {formatCollateralRatio(final)}
            </span>
        </div>
    );
};
