import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { Fragment, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import ShowFirstIcon from 'src/assets/icons/orderbook-first.svg';
import ShowAllIcon from 'src/assets/icons/orderbook-full.svg';
import ShowLastIcon from 'src/assets/icons/orderbook-last.svg';
import WarningCircleIcon from 'src/assets/icons/warning-circle.svg';
import {
    ColorBar,
    DropdownSelector,
    NavTab,
    Option,
    Spinner,
} from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { Tooltip } from 'src/components/templates';
import {
    AggregationFactorType,
    OrderBookEntry,
    useOrderbook,
    usePrepareOrderbookData,
} from 'src/hooks';
import { setOrderType, setUnitPrice } from 'src/store/landingOrderForm';
import { ColorFormat, OrderType } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    getMaxAmount,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const AGGREGATION_OPTIONS: (Option<string> & { multiplier: number })[] = [
    { label: '0.01', value: '1', multiplier: 1 },
    { label: '0.1', value: '10', multiplier: 10 },
    { label: '1', value: '100', multiplier: 100 },
    { label: '5', value: '500', multiplier: 500 },
    { label: '10', value: '1000', multiplier: 1000 },
];

const ORDERBOOK_DOUBLE_MAX_LINES = 12;
const ORDERBOOK_SINGLE_MAX_LINES = 26;

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
    aggregationFactor,
}: {
    value: LoanValue;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
    align: 'left' | 'right';
    aggregationFactor: AggregationFactorType;
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
    const price = useMemo(() => {
        if (amount.isZero()) {
            return '';
        }

        return formatLoanValue(
            value,
            'price',
            Math.abs(Math.log10(Math.min(aggregationFactor, 100) / 100)) // get the power of 10 of the aggregation factor for the number of decimals, but never more than 2
        );
    }, [aggregationFactor, amount, value]);

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
            <OrderBookCell value={price} color={color} fontWeight='semibold' />
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
    showTicker: boolean;
};

type VisibilityAction = 'showOnlyBorrow' | 'showOnlyLend' | 'reset';

const initialState: VisibilityState = {
    showBorrow: true,
    showLend: true,
    showTicker: true,
};

const reducer = (
    state: VisibilityState,
    action: VisibilityAction
): VisibilityState => {
    switch (action) {
        case 'showOnlyBorrow':
            if (!state.showLend) {
                return initialState;
            }
            return {
                ...state,
                showBorrow: true,
                showLend: false,
                showTicker: false,
            };
        case 'showOnlyLend':
            if (!state.showBorrow) {
                return initialState;
            }
            return {
                ...state,
                showBorrow: false,
                showLend: true,
                showTicker: false,
            };
        default:
            return initialState;
    }
};

export const OrderBookWidget = ({
    orderbook,
    currency,
    marketPrice,
    onFilterChange,
    onAggregationChange,
    variant = 'default',
    isCurrencyDelisted,
}: {
    orderbook: Pick<ReturnType<typeof useOrderbook>[0], 'data' | 'isLoading'>;
    currency: CurrencySymbol;
    marketPrice?: LoanValue;
    onFilterChange?: (filter: VisibilityState) => void;
    onAggregationChange?: (multiplier: number) => void;
    variant?: 'default' | 'itayose';
    isCurrencyDelisted: boolean;
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        onFilterChange?.(state);
    }, [onFilterChange, state]);

    const [aggregationFactor, setAggregationFactor] =
        useState<AggregationFactorType>(1);

    useEffect(() => {
        onAggregationChange?.(aggregationFactor);
    }, [onAggregationChange, aggregationFactor]);

    const globalDispatch = useDispatch();

    const [limit, setLimit] = useState(ORDERBOOK_DOUBLE_MAX_LINES);
    useEffect(() => {
        setLimit(
            state.showBorrow && state.showLend
                ? ORDERBOOK_DOUBLE_MAX_LINES
                : ORDERBOOK_SINGLE_MAX_LINES
        );
    }, [state]);

    const borrowOrders = usePrepareOrderbookData(
        orderbook.data,
        'borrowOrderbook',
        limit,
        aggregationFactor
    );

    const lendOrders = usePrepareOrderbookData(
        orderbook.data,
        'lendOrderbook',
        limit,
        aggregationFactor
    );

    const maxBorrowAmount = useMemo(
        () => getMaxAmount(borrowOrders),
        [borrowOrders]
    );

    const maxLendAmount = useMemo(() => getMaxAmount(lendOrders), [lendOrders]);

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={maxBorrowAmount}
                        aggregationFactor={aggregationFactor}
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
        [aggregationFactor, currency, maxBorrowAmount]
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
                        totalAmount={maxLendAmount}
                        aggregationFactor={aggregationFactor}
                        position='lend'
                        align='left'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
        ],
        [aggregationFactor, currency, maxLendAmount]
    );

    const handleClick = (rowId: string, side: OrderSide): void => {
        const rowData =
            side === OrderSide.BORROW
                ? lendOrders[parseInt(rowId)]
                : borrowOrders[parseInt(rowId)];
        globalDispatch(setOrderType(OrderType.LIMIT));
        globalDispatch(setUnitPrice(rowData.value.price));
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
        <div className='flex h-full w-full flex-col justify-start gap-y-3 rounded-b-2xl border border-white-10 bg-cardBackground/60 px-3 shadow-tab'>
            <div className='-mx-3 h-[60px] w-1/2'>
                <NavTab text='Order Book' active={true} />
            </div>
            {isCurrencyDelisted && (
                <div className='-mx-3 flex h-9 flex-row items-center gap-3 bg-black-20 px-4'>
                    <WarningCircleIcon className='h-4 w-4' />
                    <div className='typography-caption-2 w-full text-planetaryPurple'>
                        {currency} will be delisted
                    </div>
                </div>
            )}
            <div className='flex flex-row justify-between'>
                <div className='flex h-8 flex-row items-start gap-3'>
                    <OrderBookIcon
                        name='Show All Orders'
                        Icon={<ShowAllIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('reset')}
                        active={state.showBorrow && state.showLend}
                    />
                    <OrderBookIcon
                        name='Show Only Lend Orders'
                        Icon={<ShowLastIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('showOnlyLend')}
                        active={!state.showBorrow && state.showLend}
                    />
                    <OrderBookIcon
                        name='Show Only Borrow Orders'
                        Icon={<ShowFirstIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('showOnlyBorrow')}
                        active={!state.showLend && state.showBorrow}
                    />
                </div>
                <div className='flex items-center justify-end'>
                    <div className='w-20'>
                        <DropdownSelector
                            optionList={AGGREGATION_OPTIONS}
                            onChange={v =>
                                setAggregationFactor(
                                    Number(v) as AggregationFactorType
                                )
                            }
                            variant='fullWidth'
                        />
                    </div>
                </div>
            </div>
            <div className='h-[836px] tablet:h-full'>
                {orderbook.isLoading ? (
                    <div className='flex h-full w-full items-center justify-center'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div
                            className={classNames('flex pb-3', {
                                'h-fit': state.showBorrow && state.showLend,
                                'h-[40px]': !state.showBorrow,
                            })}
                        >
                            <CoreTable
                                data={state.showBorrow ? borrowOrders : []}
                                columns={buyColumns}
                                options={{
                                    responsive: false,
                                    name: 'buyOrders',
                                    border: false,
                                    onLineClick: handleBuyOrdersClick,
                                    hoverRow: handleBuyOrdersHoverRow,
                                    compact: true,
                                }}
                            />
                        </div>
                        {state.showTicker && (
                            <div className='typography-portfolio-heading -mx-3 flex h-14 flex-row items-center justify-between bg-black-20 px-4'>
                                <span
                                    className={classNames('font-semibold', {
                                        'flex flex-row items-center gap-2 text-white':
                                            variant === 'itayose',
                                        'text-nebulaTeal':
                                            marketPrice &&
                                            variant === 'default',
                                        'text-slateGray': !marketPrice,
                                    })}
                                    data-testid='current-market-price'
                                >
                                    <p>
                                        {formatLoanValue(marketPrice, 'price')}
                                    </p>
                                    {variant === 'itayose' && (
                                        <Tooltip>
                                            <p className='text-white'>
                                                Overlapping orders are
                                                aggregated to show net amounts.
                                                The price indicates the
                                                estimated opening price.
                                            </p>
                                        </Tooltip>
                                    )}
                                </span>

                                <span className='font-normal text-slateGray'>
                                    {formatLoanValue(marketPrice, 'rate')}
                                </span>
                            </div>
                        )}
                        <div
                            className={classNames('flex pt-3', {
                                'h-fit': state.showBorrow && state.showLend,
                                'h-0': !state.showLend,
                            })}
                        >
                            <CoreTable
                                data={state.showLend ? lendOrders : []}
                                columns={[...sellColumns].reverse()}
                                options={{
                                    responsive: false,
                                    name: 'sellOrders',
                                    border: false,
                                    onLineClick: handleSellOrdersClick,
                                    hoverRow: handleSellOrdersHoverRow,
                                    showHeaders: false,
                                    compact: true,
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
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
