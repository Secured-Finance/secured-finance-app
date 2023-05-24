import { ArrowUpIcon } from '@heroicons/react/outline';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ColorBar, Spinner } from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
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
        className={classNames('typography-caption-2 z-[1]', {
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
    <div className='flex justify-center'>
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
    align,
}: {
    value: LoanValue;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
    align: 'left' | 'right';
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
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
    align,
}: {
    value: LoanValue;
    display: boolean;
    align: 'left' | 'right';
}) => {
    return (
        <div
            className={classNames('flex', {
                'justify-start': align === 'left',
                'justify-end': align === 'right',
            })}
        >
            {display ? (
                <OrderBookCell value={formatLoanValue(value, 'rate')} />
            ) : (
                <OrderBookCell />
            )}
        </div>
    );
};

export const OrderWidget = ({
    buyOrders,
    sellOrders,
    currency,
    hideMidPrice = false,
}: {
    buyOrders: Array<OrderBookEntry>;
    sellOrders: Array<OrderBookEntry>;
    currency: CurrencySymbol;
    hideMidPrice?: boolean;
}) => {
    const dispatch = useDispatch();
    const isTabletOrMobile = useBreakpoint('tablet');
    const tableAlign = useMemo(
        () => (isTabletOrMobile ? 'left' : 'right'),
        [isTabletOrMobile]
    );
    const oppositeTableAlign = useMemo(
        () => (isTabletOrMobile ? 'right' : 'left'),
        [isTabletOrMobile]
    );

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
                        align='left'
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
                    <TableHeader
                        title={`Amount (${currency})`}
                        align='center'
                    />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                        align='right'
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
                        align={oppositeTableAlign}
                    />
                ),
                header: () => (
                    <TableHeader title='Lend APR' align={oppositeTableAlign} />
                ),
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => (
                    <TableHeader
                        title={`Amount (${currency})`}
                        align='center'
                    />
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
                        align={tableAlign}
                    />
                ),
                header: () => <TableHeader title='Price' align={tableAlign} />,
            }),
        ],
        [currency, oppositeTableAlign, tableAlign, totalSellAmount]
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

    const isLoading = buyOrders.length === 0 || sellOrders.length === 0;

    return (
        <div className='grid w-full grid-cols-1 place-content-center gap-x-4 tablet:grid-cols-2'>
            <div className='row-start-2 flex h-14 flex-row items-center justify-center gap-4 border-b border-white-10 bg-black-20 tablet:col-span-2 tablet:row-start-1'>
                {!hideMidPrice && (
                    <>
                        <div className='flex flex-row items-center gap-1'>
                            <ArrowUpIcon className='flex h-3 text-teal' />
                            <span
                                className='typography-portfolio-heading font-semibold text-teal'
                                data-testid='last-mid-price'
                            >
                                {formatLoanValue(lastMidValue, 'price')}
                            </span>
                        </div>

                        <span className='typography-portfolio-heading font-normal text-slateGray'>
                            {formatLoanValue(lastMidValue, 'rate')}
                        </span>
                    </>
                )}
            </div>
            {isLoading ? (
                <div className='col-span-2 row-start-3 flex h-full w-full items-center justify-center pt-24'>
                    <Spinner />
                </div>
            ) : (
                <>
                    <CoreTable
                        data={sellOrders}
                        columns={
                            isTabletOrMobile
                                ? [...sellColumns].reverse()
                                : sellColumns
                        }
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
                </>
            )}
        </div>
    );
};
