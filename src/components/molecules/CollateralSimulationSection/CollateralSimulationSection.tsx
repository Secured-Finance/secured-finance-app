import { useMemo } from 'react';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { CollateralBook, useOrderEstimation, useZCUsage } from 'src/hooks';
import {
    amountFormatterFromBase,
    formatCollateralRatio,
    usdFormat,
} from 'src/utils';
import { MAX_COVERAGE, computeAvailableToBorrow } from 'src/utils/collateral';
import { Amount, Maturity } from 'src/utils/entities';
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
    maturity,
    tradeAmount,
}: {
    collateral: CollateralBook;
    maturity: Maturity;
    tradeAmount: Amount;
}) => {
    const { address } = useAccount();

    const { data: orderEstimationInfo } = useOrderEstimation(address);

    const getZCUsage = useZCUsage(address);

    const filledAmount = amountFormatterFromBase[tradeAmount.currency](
        orderEstimationInfo?.filledAmount ?? BigInt(0)
    );

    const zcUsage = formatCollateralRatio(
        getZCUsage(maturity.toNumber(), tradeAmount.currency, filledAmount)
    );

    const coverage = useMemo(
        () => Number(orderEstimationInfo?.coverage) ?? 0,
        [orderEstimationInfo?.coverage]
    );

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
        ['ZC Usage', zcUsage],
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
