import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import ShowFirstIcon from 'src/assets/icons/orderbook-first.svg';
import ShowAllIcon from 'src/assets/icons/orderbook-full.svg';
import ShowLastIcon from 'src/assets/icons/orderbook-last.svg';
import { NavTab, Spinner } from 'src/components/atoms';
import { TableHeader } from 'src/components/molecules';
import {
    AggregationFactorType,
    OrderBookEntry,
    useBreakpoint,
    useOrderbook,
    usePrepareOrderbookData,
} from 'src/hooks';
import { setOrderType, setUnitPrice } from 'src/store/landingOrderForm';
import { ColorFormat, OrderType } from 'src/types';
import {
    CurrencySymbol,
    ZERO_BI,
    currencyMap,
    divide,
    formatLoanValue,
    getMaxAmount,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { ColorBar } from './ColorBar';
import { CoreTable } from './CoreTable';

const ORDERBOOK_DOUBLE_MAX_LINES = 15;
const ORDERBOOK_SINGLE_MAX_LINES = 30;

const columnHelper = createColumnHelper<OrderBookEntry>();

const OrderBookCell = ({
    value = '',
    color = 'neutral',
}: {
    value?: string;
} & ColorFormat) => (
    <span
        className={clsx(
            'z-[1] font-tertiary text-xs font-normal leading-[14px] laptop:text-xs laptop:leading-4',
            {
                'text-error-300': color === 'negative',
                'text-success-300': color === 'positive',
                'text-neutral-50': color === 'neutral',
                'text-neutral-400': color === 'disabled',
                'text-warning-300': color === 'warning',
            }
        )}
    >
        {value ? value : <Fragment>&nbsp;</Fragment>}
    </span>
);

const AmountCell = ({
    value,
    amount,
    totalAmount,
    position,
    currency,
    cbLimit,
}: {
    value: bigint;
    amount: bigint;
    totalAmount: bigint;
    position: 'borrow' | 'lend';
    currency: CurrencySymbol;
    cbLimit: boolean;
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
    let val: string | undefined;
    if (value === ZERO_BI) {
        val = undefined;
    } else if (cbLimit) {
        val = 'CB Limit';
    } else {
        val = ordinaryFormat(
            currencyMap[currency].fromBaseUnit(value),
            currencyMap[currency].roundingDecimal,
            currencyMap[currency].roundingDecimal
        );
    }
    return (
        <div className='relative flex items-center justify-end'>
            <OrderBookCell
                value={val}
                color={cbLimit ? 'warning' : 'neutral'}
            />
            <ColorBar
                value={amount}
                total={totalAmount}
                color={color}
                align='right'
            />
        </div>
    );
};

const PriceCell = ({
    value,
    amount,
    position,
    aggregationFactor,
    cbLimit,
}: {
    value: LoanValue;
    amount: bigint;
    position: 'borrow' | 'lend';
    aggregationFactor: AggregationFactorType;
    cbLimit: boolean;
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
    const price = useMemo(() => {
        if (amount === ZERO_BI) {
            return '';
        }

        return formatLoanValue(
            value,
            'price',
            Math.abs(Math.log10(Math.min(aggregationFactor, 100) / 100)) // get the power of 10 of the aggregation factor for the number of decimals, but never more than 2
        );
    }, [aggregationFactor, amount, value]);

    return (
        <div className='flex items-center justify-start'>
            <OrderBookCell value={price} color={cbLimit ? 'disabled' : color} />
        </div>
    );
};

const AprCell = ({
    value,
    display,
}: {
    value: LoanValue;
    display: boolean;
}) => {
    return (
        <div className='flex items-center justify-center'>
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
};

type VisibilityAction = 'showOnlyBorrow' | 'showOnlyLend' | 'reset';

const initialState: VisibilityState = {
    showBorrow: true,
    showLend: true,
};

const reducer = (
    state: VisibilityState,
    action: VisibilityAction
): VisibilityState => {
    switch (action) {
        case 'showOnlyBorrow':
            return {
                ...state,
                showBorrow: true,
                showLend: false,
            };
        case 'showOnlyLend':
            return {
                ...state,
                showBorrow: false,
                showLend: true,
            };
        default:
            return initialState;
    }
};

const aggregationFactor = 1;

export const NewOrderBookWidget = ({
    orderbook,
    currency,
    marketPrice,
    onFilterChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAggregationChange,
    isLoadingMap,
    rowsToRenderMobile = 12,
}: {
    orderbook: Pick<ReturnType<typeof useOrderbook>[0], 'data' | 'isLoading'>;
    currency: CurrencySymbol;
    marketPrice?: LoanValue;
    onFilterChange?: (filter: VisibilityState) => void;
    onAggregationChange?: (multiplier: number) => void;
    isLoadingMap?: Record<OrderSide, boolean>;
    rowsToRenderMobile?: 10 | 12 | 14 | 16 | 18 | 22;
}) => {
    const isTablet = useBreakpoint('laptop');
    const singleMaxLines = isTablet
        ? rowsToRenderMobile
        : ORDERBOOK_SINGLE_MAX_LINES;
    const doubleMaxLines = isTablet
        ? rowsToRenderMobile / 2
        : ORDERBOOK_DOUBLE_MAX_LINES;

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        onFilterChange?.(state);
    }, [onFilterChange, state]);

    const globalDispatch = useDispatch();

    const [limit, setLimit] = useState(doubleMaxLines);
    useEffect(() => {
        setLimit(
            state.showBorrow && state.showLend ? doubleMaxLines : singleMaxLines
        );
    }, [doubleMaxLines, singleMaxLines, state]);

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

    const maxAmountInOrderbook = useMemo(() => {
        const maxLendAmount = getMaxAmount(lendOrders);
        const maxBorrowAmount = getMaxAmount(borrowOrders);
        return maxLendAmount > maxBorrowAmount
            ? maxLendAmount
            : maxBorrowAmount;
    }, [borrowOrders, lendOrders]);

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        aggregationFactor={aggregationFactor}
                        position='borrow'
                        cbLimit={false}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='Price'
                        align='left'
                        horizontalPadding={false}
                    />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={info.row.original.amount !== ZERO_BI}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='APR'
                        align='center'
                        horizontalPadding={false}
                    />
                ),
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={maxAmountInOrderbook}
                        position='borrow'
                        currency={currency}
                        cbLimit={false}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='Amount'
                        align='right'
                        horizontalPadding={false}
                    />
                ),
            }),
        ],
        [currency, maxAmountInOrderbook]
    );

    const sellColumns = useMemo(
        () => [
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={maxAmountInOrderbook}
                        position='lend'
                        currency={currency}
                        cbLimit={false}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='Amount'
                        align='right'
                        horizontalPadding={false}
                    />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={info.row.original.amount !== ZERO_BI}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='APR'
                        align='center'
                        horizontalPadding={false}
                    />
                ),
            }),
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        aggregationFactor={aggregationFactor}
                        position='lend'
                        cbLimit={false}
                    />
                ),
                header: () => (
                    <TableHeader
                        title='Price'
                        align='left'
                        horizontalPadding={false}
                    />
                ),
            }),
        ],
        [currency, maxAmountInOrderbook]
    );

    const handleClick = (rowId: string, side: OrderSide): void => {
        const rowData =
            side === OrderSide.BORROW
                ? lendOrders[parseInt(rowId)]
                : borrowOrders[parseInt(rowId)];
        globalDispatch(setOrderType(OrderType.LIMIT));
        globalDispatch(
            setUnitPrice(divide(rowData.value.price, 100).toString())
        );
    };

    const handleMobileToggleClick = useCallback(() => {
        if (state.showBorrow && state.showLend) {
            dispatch('showOnlyLend');
        } else if (!state.showBorrow && state.showLend) {
            dispatch('showOnlyBorrow');
        } else if (state.showBorrow && !state.showLend) {
            dispatch('reset');
        }
    }, [state.showBorrow, state.showLend]);

    const handleSellOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.BORROW);
    };

    const handleBuyOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.LEND);
    };

    const handleSellOrdersHoverRow = (rowId: string) => {
        const rowData = lendOrders[parseInt(rowId)];
        return rowData.amount !== ZERO_BI;
    };

    const handleBuyOrdersHoverRow = (rowId: string) => {
        const rowData = borrowOrders[parseInt(rowId)];
        return rowData.amount !== ZERO_BI;
    };

    return (
        <div className='flex h-full w-full flex-col justify-start gap-y-1 overflow-hidden laptop:flex-col-reverse laptop:gap-y-0 laptop:rounded-b-xl laptop:bg-cardBackground/60 laptop:shadow-tab'>
            <div className='table h-full'>
                {orderbook.isLoading ? (
                    <div className='table-cell text-center align-middle'>
                        <div className='inline-block'>
                            <Spinner />
                        </div>
                    </div>
                ) : (
                    <div className='flex h-full flex-col laptop:gap-y-0'>
                        <div
                            className={clsx('flex', {
                                'h-fit': state.showBorrow && state.showLend,
                                'h-5 laptop:h-7': !state.showBorrow,
                            })}
                        >
                            <CoreTable
                                data={state.showBorrow ? borrowOrders : []}
                                columns={buyColumns}
                                options={{
                                    name: 'buyOrders',
                                    onLineClick: handleBuyOrdersClick,
                                    hoverRow: handleBuyOrdersHoverRow,
                                    isLastRowLoading:
                                        isLoadingMap !== undefined
                                            ? isLoadingMap[OrderSide.BORROW]
                                            : false,
                                    hideColumnIds: isTablet ? ['apr'] : [],
                                }}
                            />
                        </div>
                        <div className='flex h-auto flex-row items-center justify-between py-1.5 laptop:h-fit laptop:bg-black-20 laptop:px-4 laptop:py-3'>
                            <span
                                className='font-secondary text-[18px] font-semibold leading-6 text-neutral-50'
                                data-testid='current-market-price'
                            >
                                <p>{formatLoanValue(marketPrice, 'price')}</p>
                            </span>
                            <span className='font-secondary text-sm font-semibold leading-5 text-[#D4FCFF] laptop:text-sm laptop:leading-[22px]'>
                                {formatLoanValue(marketPrice, 'rate')}
                            </span>
                        </div>
                        <div
                            className={clsx('flex', {
                                'h-fit': state.showBorrow && state.showLend,
                                'h-0': !state.showLend,
                            })}
                        >
                            <CoreTable
                                data={state.showLend ? lendOrders : []}
                                columns={[...sellColumns].reverse()}
                                options={{
                                    name: 'sellOrders',
                                    showHeaders: false,
                                    onLineClick: handleSellOrdersClick,
                                    hoverRow: handleSellOrdersHoverRow,
                                    isFirstRowLoading:
                                        isLoadingMap !== undefined
                                            ? isLoadingMap[OrderSide.LEND]
                                            : false,
                                    hideColumnIds: isTablet ? ['apr'] : [],
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className='flex flex-col laptop:flex-col-reverse'>
                <div className='flex flex-row items-center justify-between gap-1 border-neutral-700 laptop:flex-row-reverse laptop:border-b laptop:px-3 laptop:py-2'>
                    <div className='flex flex-1 rounded border-0.5 border-neutral-500 bg-neutral-700 px-2 py-1 font-secondary text-[11px] leading-4 text-neutral-400 laptop:w-fit laptop:flex-none laptop:border-none laptop:bg-neutral-600 laptop:py-[2px] laptop:text-xs laptop:leading-5'>
                        {aggregationFactor / 100}
                    </div>
                    {isTablet ? (
                        <OrderBookIconMobile
                            name='Toggle'
                            showBorrow={state.showBorrow}
                            showLend={state.showLend}
                            onClick={handleMobileToggleClick}
                        />
                    ) : (
                        <div className='flex flex-row items-start gap-3'>
                            <OrderBookIcon
                                name='Show All Orders'
                                Icon={<ShowAllIcon className='h-[10px] w-3' />}
                                onClick={() => dispatch('reset')}
                                active={state.showBorrow && state.showLend}
                            />
                            <OrderBookIcon
                                name={`${
                                    isTablet ? 'Mobile ' : ''
                                }Show Only Lend Orders`}
                                Icon={<ShowLastIcon className='h-[10px] w-3' />}
                                onClick={() => dispatch('showOnlyLend')}
                                active={!state.showBorrow && state.showLend}
                            />
                            <OrderBookIcon
                                name={`${
                                    isTablet ? 'Mobile ' : ''
                                }Show Only Borrow Orders`}
                                Icon={
                                    <ShowFirstIcon className='h-[10px] w-3' />
                                }
                                onClick={() => dispatch('showOnlyBorrow')}
                                active={!state.showLend && state.showBorrow}
                            />
                        </div>
                    )}
                </div>
                <div className='hidden border-neutral-700 laptop:block laptop:border-b'>
                    <div className='h-[60px] w-1/2'>
                        <NavTab text='Order Book' active={true} />
                    </div>
                </div>
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
        className={clsx(
            'rounded border-0.5 border-neutral-500 px-[10px] py-[11px] hover:bg-neutral-700',
            {
                'bg-neutral-700': active,
                'bg-neutral-800': !active,
            }
        )}
        onClick={onClick}
    >
        {Icon}
    </button>
);

const OrderBookIconMobile = ({
    name,
    showBorrow,
    showLend,
    onClick,
}: {
    name: string;
    showBorrow: boolean;
    showLend: boolean;
    onClick: () => void;
}) => (
    <button
        key={name}
        aria-label={name}
        className={clsx(
            'flex h-6 w-6 items-center justify-center rounded border-0.5 border-neutral-500 bg-neutral-800'
        )}
        onClick={onClick}
    >
        {showBorrow && showLend ? (
            <div className='flex flex-col gap-[2px]'>
                <span className='h-6px w-14px rounded-sm bg-error-300'></span>
                <span className='h-6px w-14px rounded-sm bg-success-500'></span>
            </div>
        ) : (
            <span
                className={clsx('h-14px w-14px rounded-sm', {
                    'bg-success-500': !showBorrow && showLend,
                    'bg-error-300': showBorrow && !showLend,
                })}
            ></span>
        )}
    </button>
);
