import { OrderSide } from '@secured-finance/sf-client';
import { FormatCollateralUsage, SectionWithItems } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import {
    CollateralBook,
    useBorrowableAmount,
    useOrderEstimation,
    useZCUsage,
} from 'src/hooks';
import { amountFormatterFromBase, usdFormat } from 'src/utils';
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
    assetPrice,
    side,
}: {
    collateral: CollateralBook;
    maturity: Maturity;
    tradeAmount: Amount;
    assetPrice: number;
    side: OrderSide;
}) => {
    const { address } = useAccount();

    const { data: orderEstimationInfo } = useOrderEstimation(address);

    const { data: availableToBorrow } = useBorrowableAmount(
        address,
        tradeAmount.currency
    );

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

    const coverage = Number(orderEstimationInfo?.coverage) ?? 0;

    const remainingToBorrow = Math.max(
        0,
        side === OrderSide.BORROW
            ? availableToBorrow - tradeAmount.value
            : availableToBorrow
    );

    const items: [string | React.ReactNode, string | React.ReactNode][] = [
        ['Borrow Remaining', usdFormat(remainingToBorrow * assetPrice, 2)],
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
