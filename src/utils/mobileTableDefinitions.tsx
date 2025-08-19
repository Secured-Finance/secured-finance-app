import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { OrderSide } from '@secured-finance/sf-client';
import { MaturityConverter } from './maturityConverter';
import * as dayjs from 'dayjs';
import {
    CurrencySymbol,
    currencyMap,
    formatTimestampDDMMYY,
    isMaturityPastDays,
    isPastDate,
    ordinaryFormat,
} from 'src/utils';

export const AmountCell = ({
    ccy,
    amount,
}: {
    ccy: CurrencySymbol;
    amount: bigint | undefined;
}) => {
    const currency = currencyMap[ccy];
    if (amount === undefined) {
        return null;
    }
    return (
        <span className='font-numerical text-3 leading-4 text-white'>
            {ordinaryFormat(
                currency.fromBaseUnit(amount),
                currency.roundingDecimal,
                currency.roundingDecimal
            )}
        </span>
    );
};

export const TextCell = ({ text }: { text: string }) => {
    return <span className='text-3 leading-4 text-white'>{text}</span>;
};

export const OrderTimeCell = ({
    timestamp,
    blockExplorerLink,
}: {
    timestamp: number;
    blockExplorerLink?: string;
}) => {
    return (
        <div className='flex items-center gap-1'>
            <span className='font-numerical text-3 leading-4 text-white'>
                {formatTimestampDDMMYY(timestamp)}
            </span>
            {blockExplorerLink && (
                <ArrowTopRightOnSquareIcon
                    className='h-4 w-4 cursor-pointer text-primary-300'
                    onClick={() => {
                        window.open(blockExplorerLink, '_blank');
                    }}
                />
            )}
        </div>
    );
};

const formatMaturity = (
    maturityTimeStamp: number,
    timeUnit: 'day' | 'hours' | 'minutes',
    currentTime: number
) => dayjs.unix(maturityTimeStamp).diff(currentTime, timeUnit);

export const MaturityCell = ({
    timestamp,
    side,
    currency,
    delistedCurrencySet,
}: {
    timestamp: number;
    side: OrderSide;
    currency: CurrencySymbol;
    delistedCurrencySet: Set<CurrencySymbol>;
}) => {
    const currentTime = Date.now();
    const dayToMaturity = formatMaturity(timestamp, 'day', currentTime);

    const firstLine = MaturityConverter.formatDate(timestamp);
    let secondLine = '';

    if (!isPastDate(timestamp)) {
        const diffHours = formatMaturity(timestamp, 'hours', currentTime);
        const diffMinutes =
            formatMaturity(timestamp, 'minutes', currentTime) % 60;

        if (dayToMaturity > 1) {
            secondLine = `${dayToMaturity} days`;
        } else if (dayToMaturity === 1) {
            secondLine = `${dayToMaturity} day`;
        } else {
            secondLine = `${diffHours}h ${diffMinutes}m`;
        }
    } else {
        if (currency && !delistedCurrencySet.has(currency)) {
            secondLine = '';
        } else {
            if (side === OrderSide.BORROW) {
                secondLine = isMaturityPastDays(timestamp, 7)
                    ? 'Repay'
                    : `${7 - Math.abs(dayToMaturity)}d left to repay`;
            } else {
                secondLine = isMaturityPastDays(timestamp, 7)
                    ? 'Redeemable'
                    : `${7 - Math.abs(dayToMaturity)}d to redeem`;
            }
        }
    }

    return (
        <div className='flex items-center gap-1'>
            <span className='text-2.5 leading-3 text-neutral-400'>
                {firstLine}
            </span>
            <span className='text-3 leading-4 text-neutral-50'>
                {secondLine}
            </span>
        </div>
    );
};

export const MobileTableWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className='scrollbar-table max-h-[600px] min-h-[25vh] overflow-y-scroll rounded-b-xl'>
            {children}
        </div>
    );
};
