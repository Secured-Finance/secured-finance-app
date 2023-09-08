import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { Fragment, useEffect, useMemo, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import ShowFirstIcon from 'src/assets/icons/orderbook-first.svg';
import ShowAllIcon from 'src/assets/icons/orderbook-full.svg';
import ShowLastIcon from 'src/assets/icons/orderbook-last.svg';

import { ColorBar, DropdownSelector, Spinner } from 'src/components/atoms';
import { CoreTable, Tab, TableHeader } from 'src/components/molecules';
import { OrderBookEntry, sortOrders, useOrderbook } from 'src/hooks';
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
    getOrderbookAggregationFactor,
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
        className={classNames('typography-caption-2 z-[1] text-right', {
            'text-galacticOrange': color === 'negative',
            'text-nebulaTeal': color === 'positive',
            'text-neutral-6': color === 'neutral',
            'font-semibold': fontWeight === 'semibold',
        })}
    >
        {value ? value : <Fragment>&nbsp;</Fragment>}
    </span>
);

const AmountCell = ({
    value,
    currency,
}: {
    value: BigNumber;
    currency: CurrencySymbol;
}) => (
    <div className='typography-caption-2 flex justify-end pr-[25%] text-neutral-6'>
        {value.eq(0) ? (
            <OrderBookCell />
        ) : (
            <OrderBookCell
                value={ordinaryFormat(
                    currencyMap[currency].fromBaseUnit(value),
                    currencyMap[currency].roundingDecimal,
                    currencyMap[currency].roundingDecimal
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
    return (
        <div
            className={classNames(
                'typography-caption-2 relative flex items-center overflow-visible font-bold text-neutral-6',
                {
                    'justify-start': align === 'left',
                    'justify-end': align === 'right',
                }
            )}
        >
            <OrderBookCell
                value={!amount.isZero() ? formatLoanValue(value, 'price') : ''}
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
            className={classNames('typography-caption-2 flex', {
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

type VisibilityState = {
    showBorrow: boolean;
    showLend: boolean;
    showMidPrice: boolean;
};

type VisibilityAction = 'toggleBorrow' | 'toggleLend' | 'reset';

const initialState: VisibilityState = {
    showBorrow: true,
    showLend: true,
    showMidPrice: true,
};

const reducer = (
    state: VisibilityState,
    action: VisibilityAction
): VisibilityState => {
    switch (action) {
        case 'toggleLend':
            return {
                ...state,
                showBorrow: true,
                showLend: !state.showLend,
                showMidPrice: !state.showMidPrice,
            };
        case 'toggleBorrow':
            return {
                ...state,
                showBorrow: !state.showBorrow,
                showLend: true,
                showMidPrice: !state.showMidPrice,
            };
        default:
            return initialState;
    }
};

export const OrderBookWidget = ({
    orderbook,
    currency,
    hideMidPrice = false,
}: {
    orderbook: Pick<ReturnType<typeof useOrderbook>, 'data' | 'isLoading'>;
    currency: CurrencySymbol;
    hideMidPrice?: boolean;
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const globalDispatch = useDispatch();

    const borrowOrders = useMemo(() => {
        if (orderbook.data?.borrowOrderbook) {
            const oderList = [...orderbook.data.borrowOrderbook].sort((a, b) =>
                sortOrders(a, b, 'desc')
            );
            const result = [...oderList.filter(order => order.amount.gt(0))];
            for (let index = 0; index < oderList.length; index++) {
                if (oderList[index].amount.eq(0)) {
                    result.unshift(oderList[index]);
                }
            }
            return result;
        }
        return [];
    }, [orderbook.data]);

    const lendOrders = useMemo(() => {
        if (orderbook.data?.lendOrderbook) {
            return [...orderbook.data.lendOrderbook].sort((a, b) =>
                sortOrders(a, b, 'desc')
            );
        }
        return [];
    }, [orderbook.data]);

    const totalBuyAmount = useMemo(
        () =>
            borrowOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [borrowOrders]
    );

    const totalSellAmount = useMemo(
        () =>
            lendOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [lendOrders]
    );

    const lastMidValue = useMemo(() => {
        if (borrowOrders.length === 0 || lendOrders.length === 0) {
            return LoanValue.ZERO;
        }

        return LoanValue.getMidValue(
            lendOrders[0].value,
            borrowOrders[lendOrders.length - 1].value
        );
    }, [lendOrders, borrowOrders]);

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
                header: () => <TableHeader title='Amount' align='center' />,
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
                header: () => <TableHeader title='APR' align='right' />,
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
                        align='right'
                    />
                ),
                header: () => <TableHeader title='APR' align='right' />,
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => <TableHeader title='Amount' align='center' />,
            }),
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalSellAmount}
                        position='lend'
                        align='left'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
        ],
        [currency, totalSellAmount]
    );

    useEffect(() => {
        globalDispatch(setMidPrice(lastMidValue.price));
    }, [globalDispatch, lastMidValue.price]);

    const handleClick = (rowId: string, side: OrderSide): void => {
        const rowData =
            side === OrderSide.BORROW
                ? lendOrders[parseInt(rowId)]
                : borrowOrders[parseInt(rowId)];
        globalDispatch(setOrderType(OrderType.LIMIT));
        side ? globalDispatch(setSide(side)) : null;
        side === OrderSide.BORROW
            ? globalDispatch(setSourceAccount(WalletSource.METAMASK))
            : null;
        globalDispatch(setUnitPrice(rowData.value.price));
        globalDispatch(setAmount(rowData.amount));
    };

    const handleSellOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.BORROW);
    };

    const handleBuyOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.LEND);
    };

    const handleSellOrdersHoverRow = (rowId: string) => {
        const rowData = lendOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

    const handleBuyOrdersHoverRow = (rowId: string) => {
        const rowData = borrowOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

    return (
        <div className='max-w-xs'>
            <Tab tabDataArray={[{ text: 'Order Book' }]}>
                <div className='grid w-full grid-cols-1 place-content-start gap-x-4'>
                    <div className='grid grid-cols-2 px-3 py-3'>
                        <div className='flex flex-row items-start gap-3'>
                            <OrderBookIcon
                                name='showAll'
                                Icon={<ShowAllIcon className='mr-1 h-4 w-4' />}
                                onClick={() => dispatch('reset')}
                                active={state.showBorrow && state.showLend}
                            />
                            <OrderBookIcon
                                name='showLendOrders'
                                Icon={<ShowLastIcon className='mr-1 h-4 w-4' />}
                                onClick={() => dispatch('toggleBorrow')}
                                active={!state.showBorrow && state.showLend}
                            />
                            <OrderBookIcon
                                name='showBorrowOrders'
                                Icon={
                                    <ShowFirstIcon className='mr-1 h-4 w-4' />
                                }
                                onClick={() => dispatch('toggleLend')}
                                active={!state.showLend && state.showBorrow}
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-end'>
                                <div className='w-20'>
                                    <DropdownSelector
                                        optionList={getOrderbookAggregationFactor(
                                            currency
                                        )}
                                        onChange={() => null}
                                        variant='fullWidth'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row-start-3'>
                        {!hideMidPrice && state.showMidPrice && (
                            <div className='typography-portfolio-heading flex h-14 flex-row items-center justify-between bg-black-20 px-4 py-3'>
                                <span
                                    className='font-semibold text-white'
                                    data-testid='last-mid-price'
                                >
                                    {formatLoanValue(lastMidValue, 'price')}
                                </span>

                                <span className='font-normal text-slateGray'>
                                    {formatLoanValue(lastMidValue, 'rate')}
                                </span>
                            </div>
                        )}
                    </div>
                    {orderbook.isLoading ? (
                        <div className='col-span-2 row-start-3 flex h-full w-full items-center justify-center pt-24'>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            {state.showBorrow && (
                                <div className='row-start-2 px-3'>
                                    <CoreTable
                                        data={borrowOrders}
                                        columns={buyColumns}
                                        options={{
                                            responsive: false,
                                            name: 'buyOrders',
                                            border: false,
                                            onLineClick: handleBuyOrdersClick,
                                            hoverRow: handleBuyOrdersHoverRow,
                                        }}
                                    />
                                </div>
                            )}
                            {state.showLend && (
                                <div className='row-start-4 px-3'>
                                    <CoreTable
                                        data={lendOrders}
                                        columns={[...sellColumns].reverse()}
                                        options={{
                                            responsive: false,
                                            name: 'sellOrders',
                                            border: false,
                                            onLineClick: handleSellOrdersClick,
                                            hoverRow: handleSellOrdersHoverRow,
                                            showHeaders: false,
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Tab>
        </div>
    );
};

const OrderBookIcon = ({
    Icon,
    name,
    active,
    onClick,
}: {
    Icon: React.ReactNode;
    name: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        key={name}
        aria-label={name}
        className={classNames('px-[10px] py-[11px] hover:bg-universeBlue', {
            'bg-universeBlue': active,
        })}
        onClick={onClick}
    >
        {Icon}
    </button>
);
