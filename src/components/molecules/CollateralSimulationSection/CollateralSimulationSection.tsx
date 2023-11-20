import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { CollateralBook, useOrderEstimation } from 'src/hooks';
import { useZCUsage } from 'src/hooks/useZCUsage/useZCUsage';
import {
    formatAmount,
    formatCollateralRatio,
    formatLoanValue,
    prefixTilde,
    usdFormat,
} from 'src/utils';
import { MAX_COVERAGE, computeAvailableToBorrow } from 'src/utils/collateral';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    side,
    tradeValue,
    maturity,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    side: OrderSide;
    tradeValue: LoanValue;
    maturity: Maturity;
}) => {
    const { address } = useAccount();

    const { data: orderEstimationInfo } = useOrderEstimation(address);

    const getZCUsage = useZCUsage(address);

    const zcUsage = formatCollateralRatio(
        getZCUsage(maturity.toNumber(), tradeAmount.currency, tradeAmount.value)
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

    const items: [string, string | React.ReactNode][] =
        side === OrderSide.BORROW
            ? [
                  [
                      'Borrow Amount',
                      `${formatAmount(tradeAmount.value)} ${
                          tradeAmount.currency
                      }`,
                  ],
                  ['Borrow Remaining', remainingToBorrowText],
                  ['ZC Usage', zcUsage ?? 0],
                  [
                      'Collateral Usage',
                      getCollateralUsage(collateral.coverage, coverage),
                  ],
                  [
                      'Bond Price',
                      prefixTilde(
                          formatLoanValue(tradeValue ?? LoanValue.ZERO, 'price')
                      ),
                  ],
              ]
            : [
                  [
                      'Lend Amount',
                      `${formatAmount(tradeAmount.value)} ${
                          tradeAmount.currency
                      }`,
                  ],
                  [
                      'Bond Price',
                      prefixTilde(
                          formatLoanValue(tradeValue ?? LoanValue.ZERO, 'price')
                      ),
                  ],
              ];

    items.push([
        'APR',
        prefixTilde(formatLoanValue(tradeValue ?? LoanValue.ZERO, 'rate')),
    ]);

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
