import { ArrowUpIcon } from '@heroicons/react/outline';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ColorBar } from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { setMidPrice } from 'src/store/analytics';
import {
    setAmount,
    setOrderType,
    setSide,
    setSourceAccount,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { ColorFormat, OrderType } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
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
    const align = position === 'borrow' ? 'left' : 'right';
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

const AprCell = ({
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
    const dispatch = useDispatch();
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
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalBuyAmount}
                        position='borrow'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => (
                    <TableHeader title={`Amount (${currency})`} align='right' />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                    />
                ),
                header: () => <TableHeader title='Borrow APR' align='right' />,
            }),
        ],
        [currency, totalBuyAmount]
    );

    const sellColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                    />
                ),
                header: () => <TableHeader title='Lend APR' align='right' />,
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
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
                        totalAmount={totalSellAmount}
                        position='lend'
                    />
                ),
                header: () => <TableHeader title='Price' align='right' />,
            }),
        ],
        [currency, totalSellAmount]
    );

    useEffect(() => {
        dispatch(setMidPrice(lastMidValue.price));
    }, [dispatch, lastMidValue.price]);

    const handleClick = (rowId: string, side: OrderSide): void => {
        const rowData =
            side === OrderSide.BORROW
                ? sellOrders[parseInt(rowId)]
                : buyOrders[parseInt(rowId)];
        dispatch(setOrderType(OrderType.LIMIT));
        side ? dispatch(setSide(side)) : null;
        side === OrderSide.BORROW
            ? dispatch(setSourceAccount(WalletSource.METAMASK))
            : null;
        dispatch(setUnitPrice(rowData.value.price));
        dispatch(setAmount(rowData.amount));
    };

    const handleSellOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.BORROW);
    };

    const handleBuyOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.LEND);
    };

    const handleSellOrdersHoverRow = (rowId: string) => {
        const rowData = sellOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

    const handleBuyOrdersHoverRow = (rowId: string) => {
        const rowData = buyOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

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
                    data={sellOrders}
                    columns={sellColumns}
                    name='sellOrders'
                    border={false}
                    onLineClick={handleSellOrdersClick}
                    hoverRow={handleSellOrdersHoverRow}
                />
                <CoreTable
                    data={buyOrders}
                    columns={buyColumns}
                    name='buyOrders'
                    border={false}
                    onLineClick={handleBuyOrdersClick}
                    hoverRow={handleBuyOrdersHoverRow}
                />
            </div>
        </>
    );
};
