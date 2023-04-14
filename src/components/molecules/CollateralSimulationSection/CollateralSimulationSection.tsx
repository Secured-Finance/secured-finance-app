import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import { SectionWithItems } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import {
    COLLATERAL_THRESHOLD,
    formatCollateralRatio,
    formatLoanValue,
    ordinaryFormat,
} from 'src/utils';
import {
    computeAvailableToBorrow,
    MAX_COVERAGE,
    recomputeCollateralUtilization,
} from 'src/utils/collateral';
import { Amount, LoanValue } from 'src/utils/entities';

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    tradePosition,
    assetPrice,
    tradeValue,
    type,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    tradePosition: OrderSide;
    assetPrice: number;
    type: 'unwind' | 'trade';
    tradeValue?: LoanValue;
}) => {
    const collateralUsageText = `${formatCollateralRatio(
        collateral.coverage.toNumber()
    )} -> ${formatCollateralRatio(
        recomputeCollateralUtilization(
            collateral.usdCollateral,
            collateral.coverage.toNumber() / 10000,
            tradePosition === OrderSide.BORROW
                ? tradeAmount.toUSD(assetPrice)
                : -1 * tradeAmount.toUSD(assetPrice)
        ) * 10000
    )}`;

    const remainingToBorrowText = useMemo(() => {
        const availableAssetMultiplier = collateral.coverage.isZero()
            ? COLLATERAL_THRESHOLD / 100
            : (COLLATERAL_THRESHOLD - collateral.coverage.toNumber() / 100) /
              100;

        return `${ordinaryFormat(
            (collateral.usdCollateral * availableAssetMultiplier -
                tradeAmount.toUSD(assetPrice)) /
                assetPrice
        )} / ${ordinaryFormat(
            computeAvailableToBorrow(
                assetPrice,
                collateral.usdCollateral,
                collateral.coverage.toNumber() / MAX_COVERAGE
            )
        )}`;
    }, [
        assetPrice,
        collateral.coverage,
        collateral.usdCollateral,
        tradeAmount,
    ]);

    const items: [string, string][] = [
        ['Borrow Remaining', remainingToBorrowText],
        ['Collateral Usage', collateralUsageText],
    ];

    if (type === 'trade') {
        items.push([
            'APR',
            tradeValue ? formatLoanValue(tradeValue, 'rate') : 'Market Order',
        ]);
    }

    return <SectionWithItems itemList={items} />;
};
