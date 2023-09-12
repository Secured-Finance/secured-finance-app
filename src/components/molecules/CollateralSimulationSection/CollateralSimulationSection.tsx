import { useMemo } from 'react';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { CollateralBook, useOrderEstimation } from 'src/hooks';
import { formatCollateralRatio, usdFormat } from 'src/utils';
import { MAX_COVERAGE, computeAvailableToBorrow } from 'src/utils/collateral';
import { useAccount } from 'wagmi';

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
                    (coverage ?? 0) / MAX_COVERAGE,
                    collateral.collateralThreshold
                ),
                2
            ),
        [collateral.usdCollateral, collateral.collateralThreshold, coverage]
    );

    const items: [string, string | React.ReactNode][] = [
        ['Borrow Remaining', remainingToBorrowText],
        [
            'Collateral Usage',
            getCollateralUsage(collateral.coverage.toNumber(), coverage),
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
