import { ArrowUpIcon } from '@heroicons/react/outline';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { ColorBar } from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { ColorFormat } from 'src/types';
import {
    currencyMap,
    CurrencySymbol,
    formatLoanValue,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const columnHelper = createColumnHelper<OrderBookEntry>();

const OrderBookCell = ({
    value = '',
    fontWeight = 'normal',
    color = 'neutral',
}: {
    value?: string;
    fontWeight?: 'normal' | 'semibold';
} & ColorFormat) => (
    <span
        className={classNames('typography-caption-2', {
            'text-galacticOrange': color === 'negative',
            'text-nebulaTeal': color === 'positive',
            'text-neutral-6': color === 'neutral',
            'font-semibold': fontWeight === 'semibold',
        })}
    >
        {value}
    </span>
);

const AmountCell = ({
    value,
    currency,
}: {
    value: BigNumber;
    currency: CurrencySymbol;
}) => (
    <div className='flex justify-end'>
        {value.eq(0) ? (
            <OrderBookCell />
        ) : (
            <OrderBookCell
                value={ordinaryFormat(
                    currencyMap[currency].fromBaseUnit(value)
                )}
            />
        )}{' '}
    </div>
);

const PriceCell = ({
    value,
    amount,
    totalAmount,
    position,
}: {
    value: LoanValue;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
    const align = position === 'borrow' ? 'right' : 'left';
    if (amount.eq(0)) return <OrderBookCell />;
    return (
        <div
            className={classNames('flex', {
                'justify-start': align === 'left',
                'justify-end': align === 'right',
            })}
        >
            <OrderBookCell
                value={formatLoanValue(value, 'price')}
                color={color}
                fontWeight='semibold'
            />
            <ColorBar
                value={amount}
                total={totalAmount}
                color={color}
                align={align}
            />
        </div>
    );
};

const ApyCell = ({
    value,
    display,
}: {
    value: LoanValue;
    display: boolean;
}) => (
    <div className='flex justify-end'>
        {display ? (
            <OrderBookCell value={formatLoanValue(value, 'rate')} />
        ) : (
            <OrderBookCell />
        )}
    </div>
);

export const OrderWidget = ({
    buyOrders,
    sellOrders,
    currency,
}: {
    buyOrders: Array<OrderBookEntry>;
    sellOrders: Array<OrderBookEntry>;
    currency: CurrencySymbol;
}) => {
    const totalBuyAmount = useMemo(
        () =>
            buyOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [buyOrders]
    );

    const totalSellAmount = useMemo(
        () =>
            sellOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [sellOrders]
    );

    const lastMidValue = useMemo(() => {
        if (buyOrders.length === 0 || sellOrders.length === 0) {
            return LoanValue.ZERO;
        }

        return LoanValue.getMidValue(sellOrders[0].value, buyOrders[0].value);
    }, [sellOrders, buyOrders]);

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'apy',
                cell: info => (
                    <ApyCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                    />
                ),
                header: () => <TableHeader title='% APY' align='right' />,
            }),
            columnHelper.accessor('amount', {
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => (
                    <TableHeader title={`Amount (${currency})`} align='right' />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalBuyAmount}
                        position='borrow'
                    />
                ),
                header: () => <TableHeader title='Price' align='right' />,
            }),
        ],
        [currency, totalBuyAmount]
    );

    const sellColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalSellAmount}
                        position='lend'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
            columnHelper.accessor('amount', {
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => (
                    <TableHeader title={`Amount (${currency})`} align='right' />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'apy',
                cell: info => (
                    <ApyCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                    />
                ),
                header: () => <TableHeader title='% APY' align='right' />,
            }),
        ],
        [currency, totalSellAmount]
    );

    return (
        <>
            <div className='flex h-14 flex-row items-center justify-center gap-1 border-b border-white-10 bg-black-20'>
                <ArrowUpIcon className='flex h-3 text-teal' />
                <span
                    className='typography-portfolio-heading flex text-teal'
                    data-testid='last-mid-price'
                >
                    {formatLoanValue(lastMidValue, 'price')}
                </span>
                <span className='typography-portfolio-heading flex text-slateGray'>
                    {formatLoanValue(lastMidValue, 'rate')}
                </span>
            </div>
            <div className='flex flex-row gap-6'>
                <CoreTable
                    data={buyOrders}
                    columns={buyColumns}
                    name='buyOrders'
                    border={false}
                />
                <CoreTable
                    data={sellOrders}
                    columns={sellColumns}
                    name='sellOrders'
                    border={false}
                />
            </div>
        </>
    );
};
