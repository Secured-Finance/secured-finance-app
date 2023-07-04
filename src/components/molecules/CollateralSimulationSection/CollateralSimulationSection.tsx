import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import {
    divide,
    formatCollateralRatio,
    formatLoanValue,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import {
    MAX_COVERAGE,
    computeAvailableToBorrow,
    recomputeCollateralUtilization,
} from 'src/utils/collateral';
import { Amount, LoanValue } from 'src/utils/entities';

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    side,
    assetPrice,
    tradeValue,
    type,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    side: OrderSide;
    assetPrice: number;
    type: 'unwind' | 'trade';
    tradeValue?: LoanValue;
}) => {
    const remainingToBorrowText = useMemo(() => {
        const availableToBorrow = computeAvailableToBorrow(
            1,
            collateral.usdCollateral,
            collateral.coverage.toNumber() / MAX_COVERAGE,
            collateral.collateralThreshold
        );

        return `${usdFormat(
            availableToBorrow - tradeAmount.toUSD(assetPrice),
            2
        )}`;
    }, [
        collateral.usdCollateral,
        collateral.coverage,
        collateral.collateralThreshold,
        tradeAmount,
        assetPrice,
    ]);

    const recomputeCollateral = useMemo(() => {
        return recomputeCollateralUtilization(
            collateral.usdCollateral,
            collateral.coverage.toNumber(),
            tradeAmount.toUSD(assetPrice)
        );
    }, [
        collateral.usdCollateral,
        collateral.coverage,
        tradeAmount,
        assetPrice,
    ]);

    const items: [string, string | React.ReactNode][] =
        side === OrderSide.BORROW
            ? [
                  [
                      'Borrow Amount',
                      `${ordinaryFormat(tradeAmount.value)} ${
                          tradeAmount.currency
                      }`,
                  ],
                  ['Borrow Remaining', remainingToBorrowText],
                  [
                      'Collateral Usage',
                      getCollateralUsage(
                          collateral.coverage.toNumber(),
                          recomputeCollateral
                      ),
                  ],
                  [
                      'Bond Price',
                      `~ ${(
                          tradeValue && divide(tradeValue.price, 100)
                      )?.toString()}`,
                  ],
              ]
            : [
                  [
                      'Lend Amount',
                      `${ordinaryFormat(tradeAmount.value)} ${
                          tradeAmount.currency
                      }`,
                  ],
                  [
                      'Bond Price',
                      `~ ${(
                          tradeValue && divide(tradeValue.price, 100)
                      )?.toString()}`,
                  ],
              ];

    if (type === 'trade' && tradeValue) {
        items.push(['APR', `~ ${formatLoanValue(tradeValue, 'rate')}`]);
    }

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
