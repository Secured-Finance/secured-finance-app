import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLiquidationInformation } from 'src/components/atoms';
import { SectionWithItemsAndHeader } from 'src/components/atoms/SectionWithItemsAndHeader/SectionWithItemsAndHeader';
import { CollateralBook, useOrderEstimation } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { divide, formatCollateralRatio, usdFormat } from 'src/utils';
import { computeAvailableToBorrow, MAX_COVERAGE } from 'src/utils/collateral';
import { Amount } from 'src/utils/entities';
import { useAccount } from 'wagmi';
import { BorrowedCollateral } from '../BorrowedCollateral';

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    assetPrice,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    assetPrice: number;
}) => {
    const { address } = useAccount();

    const { isBorrowedCollateral } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: coverage } = useOrderEstimation(address ?? '');

    const collateralCoverage = isBorrowedCollateral
        ? coverage
        : collateral.coverage.toNumber();

    const remainingToBorrowText = useMemo(() => {
        const availableToBorrow = computeAvailableToBorrow(
            1,
            collateral.usdCollateral,
            divide(collateralCoverage ?? 0, 100) / MAX_COVERAGE,
            collateral.collateralThreshold
        );

        return `${usdFormat(
            availableToBorrow - tradeAmount.toUSD(assetPrice),
            2
        )}`;
    }, [
        collateral.usdCollateral,
        collateral.collateralThreshold,
        collateralCoverage,
        tradeAmount,
        assetPrice,
    ]);

    const borrowedCollateralLabel = (
        <div className='typography-caption text-planetaryPurple'>
            Apply Borrowing Asset as Collateral
        </div>
    );

    const items: [string, string | React.ReactNode][] = [
        ['Borrow Remaining', remainingToBorrowText],
        [
            'Collateral Usage',
            getCollateralUsage(collateral.coverage.toNumber(), coverage ?? 0),
        ],
    ];

    return (
        <SectionWithItemsAndHeader itemList={items}>
            <BorrowedCollateral label={borrowedCollateralLabel} />
        </SectionWithItemsAndHeader>
    );
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
