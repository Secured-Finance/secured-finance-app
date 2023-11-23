import { OrderSide } from '@secured-finance/sf-client';
import {
    SectionWithItems,
    getLiquidationInformation,
} from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';
import {
    CollateralBook,
    useBorrowableAmount,
    useOrderEstimation,
} from 'src/hooks';
import { formatCollateralRatio, usdFormat } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { useAccount } from 'wagmi';

const CollateralUsageItem = () => {
    return (
        <div className='flex flex-row items-center gap-1'>
            <div className='typography-caption text-planetaryPurple'>
                Collateral Usage
            </div>
            <Tooltip>
                Existing open orders are factored into your collateral usage and
                may affect remaining borrow capacity
            </Tooltip>
        </div>
    );
};

export const CollateralSimulationSection = ({
    collateral,
    tradeAmount,
    assetPrice,
    side,
}: {
    collateral: CollateralBook;
    tradeAmount: Amount;
    assetPrice: number;
    side: OrderSide;
}) => {
    const { address } = useAccount();
    const { data: coverage = 0 } = useOrderEstimation(address);
    const { data: availableToBorrow } = useBorrowableAmount(
        address,
        tradeAmount.currency
    );

    const remainingToBorrow = Math.max(
        0,
        side === OrderSide.BORROW
            ? availableToBorrow - tradeAmount.value
            : availableToBorrow
    );

    const items: [string | React.ReactNode, string | React.ReactNode][] = [
        ['Borrow Remaining', usdFormat(remainingToBorrow * assetPrice, 2)],
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
