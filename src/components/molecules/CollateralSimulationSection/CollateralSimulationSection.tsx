import { OrderSide } from '@secured-finance/sf-client';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import {
    CollateralBook,
    useBorrowableAmount,
    useOrderEstimation,
} from 'src/hooks';
import {
    formatAmount,
    formatCollateralRatio,
    formatLoanValue,
    prefixTilde,
    usdFormat,
} from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { useAccount } from 'wagmi';

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    side,
    tradeValue,
    assetPrice,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    side: OrderSide;
    tradeValue: LoanValue;
    assetPrice: number;
}) => {
    const { address } = useAccount();
    const { data: coverage = 0 } = useOrderEstimation(address);
    const { data: availableToBorrow } = useBorrowableAmount(
        address,
        tradeAmount.currency
    );

    const remainingToBorrowText = usdFormat(
        (availableToBorrow - tradeAmount.value) * assetPrice,
        2
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
