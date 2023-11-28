import { useMemo } from 'react';
import { FormatCollateralUsage, SectionWithItems } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { CollateralBook, useOrderEstimation, useZCUsage } from 'src/hooks';
import { amountFormatterFromBase, usdFormat } from 'src/utils';
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

    const zcUsage = getZCUsage(
        maturity.toNumber(),
        tradeAmount.currency,
        filledAmount
    );

    const initialZCUsage = getZCUsage(
        maturity.toNumber(),
        tradeAmount.currency,
        0
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
        [
            'ZC Usage',
            <FormatCollateralUsage
                key='ZCUsage'
                initialValue={initialZCUsage}
                finalValue={zcUsage}
                maxValue={coverage}
            />,
        ],
        [
            <CollateralUsageItem key={1} />,
            <FormatCollateralUsage
                key='collateralUsage'
                initialValue={collateral.coverage}
                finalValue={coverage}
            />,
        ],
    ];

    return <SectionWithItems itemList={items} />;
};
