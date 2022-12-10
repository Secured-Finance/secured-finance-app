import { ArrowUpIcon } from '@heroicons/react/outline';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { ColorBar } from 'src/components/atoms';
import {
    CoreTable,
    HorizontalTab,
    TableHeader,
} from 'src/components/molecules';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    percentFormat,
    Rate,
} from 'src/utils';

const columnHelper = createColumnHelper<OrderBookEntry>();

const OrderBookCell = ({
    value = '',
    color = 'neutral',
    fontWeight = 'normal',
}: {
    value?: string;
    color?: 'neutral' | 'red' | 'green';
    fontWeight?: 'normal' | 'semibold';
}) => (
    <span
        className={classNames('typography-caption-2', {
            'text-galacticOrange': color === 'red',
            'text-nebulaTeal': color === 'green',
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
    value: string;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
}) => {
    const color = position === 'borrow' ? 'red' : 'green';
    const align = position === 'borrow' ? 'right' : 'left';
    if (amount.eq(0)) return <OrderBookCell />;
    return (
        <div
            className={classNames('flex', {
                'justify-start': align === 'left',
                'justify-end': align === 'right',
            })}
        >
            <OrderBookCell value={value} color={color} fontWeight='semibold' />
            <ColorBar
                value={amount}
                total={totalAmount}
                color={color}
                align={align}
            />
        </div>
    );
};

const ApyCell = ({ value, display }: { value: Rate; display: boolean }) => (
    <div className='flex justify-end'>
        {display ? (
            <OrderBookCell value={value.toPercent()} />
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

    const lastMidPrice = useMemo(() => {
        if (buyOrders.length === 0 || sellOrders.length === 0) {
            return 0;
        }

        return (sellOrders[0].value.price + buyOrders[0].value.price) / 2;
    }, [sellOrders, buyOrders]);

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('value.apy', {
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
            columnHelper.accessor('value.price', {
                cell: info => (
                    <PriceCell
                        value={info.getValue().toString()}
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
            columnHelper.accessor('value.price', {
                cell: info => (
                    <PriceCell
                        value={info.getValue().toString()}
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
            columnHelper.accessor('value.apy', {
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
            <HorizontalTab
                tabTitles={['Order Book', 'Market Trades', 'My Orders']}
            >
                <>
                    <div className='flex h-14 flex-row items-center justify-center gap-1 border-b border-white-10 bg-black-20'>
                        <ArrowUpIcon className='flex h-3 text-teal' />
                        <span
                            className='typography-portfolio-heading flex text-teal'
                            data-testid='last-mid-price'
                        >
                            {lastMidPrice}
                        </span>
                        <span className='typography-portfolio-heading flex text-slateGray'>
                            {percentFormat(20)}
                        </span>
                    </div>
                    <div className='flex flex-row gap-6'>
                        <CoreTable
                            data={buyOrders}
                            columns={buyColumns}
                            name='buyOrders'
                        />
                        <CoreTable
                            data={sellOrders}
                            columns={sellColumns}
                            name='sellOrders'
                        />
                    </div>
                </>
            </HorizontalTab>
        </>
    );
};
