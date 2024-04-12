import { OrderSide } from '@secured-finance/sf-client';
import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import * as dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CurrencyIcon } from 'src/components/atoms';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { UnwindDialog, UnwindDialogType } from 'src/components/organisms';
import {
    Position,
    useBreakpoint,
    useCurrencyDelistedStatus,
    useLastPrices,
} from 'src/hooks';
import {
    resetUnitPrice,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import {
    CurrencySymbol,
    ZERO_BI,
    currencyMap,
    formatLoanValue,
    hexToCurrencySymbol,
    isMaturityPastDays,
    isPastDate,
    ordinaryFormat,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    futureValueColumnDefinition,
    loanTypeFromFVColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<
    Position & { underMinimalCollateral?: boolean }
>();

const DEFAULT_HEIGHT = 300;

const CompactActiveTradeInfo = ({
    data,
}: {
    data?: (Position & { underMinimalCollateral?: boolean })[];
}) => {
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        show: boolean;
        type: 'UNWIND' | 'REDEEM' | 'REPAY';
    }>();

    const dispatch = useDispatch();
    const router = useRouter();

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    const getMaturityDisplayValue = useCallback(
        (
            maturityTimestamp: number,
            side: OrderSide,
            currency: CurrencySymbol | undefined
        ) => {
            const currentTime = Date.now();
            const dayToMaturity = formatMaturity(
                maturityTimestamp,
                'day',
                currentTime
            );

            if (!isPastDate(maturityTimestamp)) {
                const diffHours = formatMaturity(
                    maturityTimestamp,
                    'hours',
                    currentTime
                );
                const diffMinutes =
                    formatMaturity(maturityTimestamp, 'minutes', currentTime) %
                    60;

                if (dayToMaturity > 1) {
                    return <span className='mx-1'>{dayToMaturity} Days</span>;
                } else if (dayToMaturity === 1) {
                    return `${dayToMaturity} Day`;
                } else {
                    return (
                        <>
                            {diffHours !== 0 && (
                                <span className='mx-1'>{diffHours}h</span>
                            )}
                            {diffMinutes !== 0 && <span>{diffMinutes}m</span>}
                        </>
                    );
                }
            } else {
                if (currency && !delistedCurrencySet.has(currency)) return null;

                if (side === OrderSide.BORROW) {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return `Repay`;
                    else return `${7 - Math.abs(dayToMaturity)}d left to repay`;
                } else {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return <span className='text-yellow'>Redeemable</span>;
                    else return `${7 - Math.abs(dayToMaturity)}d to redeem`;
                }
            }
        },
        [delistedCurrencySet]
    );

    if (!data || data.length === 0) return null;

    return (
        <>
            {data.map(
                (
                    order: Position & { underMinimalCollateral?: boolean },
                    i: number
                ) => {
                    const ccy = hexToCurrencySymbol(order.currency);

                    const futureValue = order.futureValue;

                    const maturity = order.maturity;
                    const maturityTimestamp = Number(maturity);
                    const side =
                        futureValue < 0 ? OrderSide.BORROW : OrderSide.LEND;

                    const contract = `${ccy} ${getUTCMonthYear(
                        maturityTimestamp
                    )}`;

                    const amount = currencyMap[
                        ccy as CurrencySymbol
                    ].fromBaseUnit(futureValue as bigint);

                    const minDecimals =
                        currencyMap[ccy as CurrencySymbol].roundingDecimal;
                    const maxDecimals =
                        currencyMap[ccy as CurrencySymbol].roundingDecimal;

                    const forwardValueDisplayValue = ordinaryFormat(
                        amount,
                        minDecimals,
                        maxDecimals
                    );

                    const pv = isPastDate(Number(maturity))
                        ? undefined
                        : order.amount;

                    let pvDisplay = null;

                    if (pv) {
                        pvDisplay = currencyMap[
                            ccy as CurrencySymbol
                        ].fromBaseUnit(pv as bigint);
                    }

                    const amountColumnValue = isPastDate(Number(maturity))
                        ? BigInt(10000)
                        : order.marketPrice;

                    const marketPrice = LoanValue.fromPrice(
                        Number(amountColumnValue.toString()),
                        Number(maturity.toString()),
                        undefined
                    );

                    const formattedLoanApr = formatLoanValue(
                        marketPrice,
                        'rate'
                    );

                    const text = futureValue < 0 ? 'Borrow' : 'Lend';

                    const maturityVal = getMaturityDisplayValue(
                        maturityTimestamp,
                        side,
                        ccy
                    );

                    return (
                        <div className='px-5' key={`active-trade-info-${i}`}>
                            <div
                                className={clsx(
                                    'flex flex-col gap-2.5 border-neutral-600 py-4 text-[#FBFAFC]',
                                    { 'border-b': i !== data.length - 1 }
                                )}
                            >
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <CurrencyIcon
                                            ccy={ccy as CurrencySymbol}
                                            variant='large'
                                        />
                                        <div className='flex flex-col items-start gap-1.5'>
                                            <h2 className='text-[15px] font-semibold leading-[19px]'>
                                                {contract}
                                            </h2>
                                            {futureValue !== ZERO_BI ? (
                                                <span
                                                    className={clsx(
                                                        'flex h-[17px] w-[45px] items-center justify-center rounded-[5px] border px-[0.375rem] py-[0.125rem] text-2xs',
                                                        {
                                                            'border-error-300 bg-error-300/10 text-error-300':
                                                                futureValue < 0,
                                                            'border-success-300 bg-success-300/10 text-success-300':
                                                                futureValue >=
                                                                1,
                                                        }
                                                    )}
                                                >
                                                    {text}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end gap-[3px]'>
                                        <h3 className='font-semibold leading-6 text-white'>
                                            {formatLoanValue(
                                                marketPrice,
                                                'price'
                                            )}
                                        </h3>
                                        {!!formattedLoanApr && (
                                            <p className='flex items-center gap-1 text-xs text-[#94A3B8]'>
                                                APR{' '}
                                                <span className='text-sm font-semibold'>
                                                    {formattedLoanApr}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='text-xs leading-4 text-[#E2E8F0]'>
                                    <ul className='flex w-full flex-col gap-1.5'>
                                        <li className='flex justify-between'>
                                            <span>Maturity</span>
                                            <span>{maturityVal}</span>
                                        </li>
                                        {!!forwardValueDisplayValue && (
                                            <li className='flex justify-between'>
                                                <span>
                                                    {futureValue < 0
                                                        ? 'Borrow'
                                                        : 'Lending'}{' '}
                                                    FV
                                                </span>
                                                <span>
                                                    {forwardValueDisplayValue}{' '}
                                                    {ccy}
                                                </span>
                                            </li>
                                        )}
                                        {!!pvDisplay && (
                                            <li className='flex justify-between'>
                                                <span>
                                                    {futureValue < 0
                                                        ? 'Borrow'
                                                        : 'Lending'}{' '}
                                                    PV
                                                </span>
                                                <span>
                                                    {pvDisplay} {ccy}
                                                </span>
                                            </li>
                                        )}
                                        {!!marketPrice && (
                                            <li className='flex justify-between'>
                                                <span>Market Price</span>
                                                <span>
                                                    {formatLoanValue(
                                                        marketPrice,
                                                        'price'
                                                    )}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='flex flex-col gap-2.5'>
                                    <button
                                        className='rounded-lg bg-[#5162FF] px-3 py-1.5 text-xs font-semibold leading-4 text-white'
                                        disabled={isPastDate(Number(maturity))}
                                        onClick={() => {
                                            setUnwindDialogData({
                                                maturity: new Maturity(
                                                    maturity
                                                ),
                                                amount: new Amount(
                                                    amount,
                                                    ccy as CurrencySymbol
                                                ),
                                                show: true,
                                                side: side,
                                                type: 'UNWIND',
                                            });
                                        }}
                                    >
                                        Unwind
                                    </button>
                                    <button
                                        className='rounded-lg border border-neutral-600 bg-neutral-50 px-3 py-1.5 text-xs font-semibold leading-4 text-neutral-600'
                                        onClick={() => {
                                            dispatch(
                                                setMaturity(Number(maturity))
                                            );
                                            handleCurrencyChange(
                                                ccy as CurrencySymbol
                                            );
                                            router.push('/advanced/');
                                        }}
                                    >
                                        Add/reduce position
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
            {unwindDialogData && (
                <UnwindDialog
                    isOpen={unwindDialogData.show}
                    onClose={() =>
                        setUnwindDialogData({
                            ...unwindDialogData,
                            show: false,
                        })
                    }
                    maturity={unwindDialogData.maturity}
                    amount={unwindDialogData.amount}
                    side={unwindDialogData.side}
                    type={unwindDialogData.type}
                />
            )}
        </>
    );
};

export const ActiveTradeTable = ({
    data,
    delistedCurrencySet,
    height,
    variant = 'default',
}: {
    data: (Position & { underMinimalCollateral?: boolean })[];
    delistedCurrencySet: Set<CurrencySymbol>;
    height?: number;
    variant?: 'contractOnly' | 'default';
}) => {
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        show: boolean;
        type: 'UNWIND' | 'REDEEM' | 'REPAY';
    }>();
    const { data: priceList } = useLastPrices();
    const router = useRouter();
    const dispatch = useDispatch();
    const isTablet = useBreakpoint('laptop');

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    const getTableActionMenu = useCallback(
        (
            maturity: number,
            amount: bigint,
            ccy: CurrencySymbol,
            side: OrderSide
        ) => {
            const items = [
                {
                    text: 'Add/Reduce',
                    onClick: (): void => {
                        dispatch(setMaturity(maturity));
                        handleCurrencyChange(ccy);
                        router.push('/advanced/');
                    },
                },
                {
                    text: 'Unwind',
                    onClick: (): void => {
                        setUnwindDialogData({
                            maturity: new Maturity(maturity),
                            amount: new Amount(amount, ccy),
                            show: true,
                            side: side,
                            type: 'UNWIND',
                        });
                    },
                },
            ];
            if (!isPastDate(maturity)) {
                return items;
            }

            let label = 'Unwind';
            let type: UnwindDialogType;
            let disableAction;

            if (delistedCurrencySet.has(ccy)) {
                if (side === OrderSide.LEND) {
                    label = 'Repay';
                    type = 'REPAY';
                } else {
                    label = 'Redeem';
                    type = 'REDEEM';
                    if (!isMaturityPastDays(maturity, 7)) {
                        disableAction = true;
                    }
                }
            }

            return [
                { ...items[0], disabled: true },
                {
                    text: label,
                    onClick: (): void => {
                        setUnwindDialogData({
                            maturity: new Maturity(maturity),
                            amount: new Amount(amount, ccy),
                            show: true,
                            side: side,
                            type: type,
                        });
                    },
                    disabled: disableAction,
                },
            ];
        },
        [delistedCurrencySet, dispatch, handleCurrencyChange, router]
    );

    const getMaturityDisplayValue = useCallback(
        (
            maturityTimestamp: number,
            side: OrderSide,
            currency: CurrencySymbol | undefined
        ) => {
            const currentTime = Date.now();
            const dayToMaturity = formatMaturity(
                maturityTimestamp,
                'day',
                currentTime
            );

            if (!isPastDate(maturityTimestamp)) {
                const diffHours = formatMaturity(
                    maturityTimestamp,
                    'hours',
                    currentTime
                );
                const diffMinutes =
                    formatMaturity(maturityTimestamp, 'minutes', currentTime) %
                    60;

                if (dayToMaturity > 1) {
                    return <span className='mx-1'>{dayToMaturity} Days</span>;
                } else if (dayToMaturity === 1) {
                    return `${dayToMaturity} Day`;
                } else {
                    return (
                        <>
                            {diffHours !== 0 && (
                                <span className='mx-1'>{diffHours}h</span>
                            )}
                            {diffMinutes !== 0 && <span>{diffMinutes}m</span>}
                        </>
                    );
                }
            } else {
                if (currency && !delistedCurrencySet.has(currency)) return null;

                if (side === OrderSide.BORROW) {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return `Repay`;
                    else return `${7 - Math.abs(dayToMaturity)}d left to repay`;
                } else {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return <span className='text-yellow'>Redeemable</span>;
                    else return `${7 - Math.abs(dayToMaturity)}d to redeem`;
                }
            }
        },
        [delistedCurrencySet]
    );

    const columns = useMemo(
        () => [
            loanTypeFromFVColumnDefinition(columnHelper, 'Type', 'side'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                variant,
                delistedCurrencySet
            ),
            columnHelper.accessor('maturity', {
                cell: info => {
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const maturityTimestamp = Number(info.getValue());

                    const side =
                        BigInt(info.row.original.futureValue) < 0
                            ? OrderSide.BORROW
                            : OrderSide.LEND;

                    return (
                        <div className='grid w-40 justify-center tablet:w-full'>
                            <div
                                className={clsx('typography-caption w-full', {
                                    'text-galacticOrange':
                                        ccy && delistedCurrencySet.has(ccy),
                                    'text-neutral7':
                                        ccy && !delistedCurrencySet.has(ccy),
                                })}
                            >
                                {getMaturityDisplayValue(
                                    maturityTimestamp,
                                    side,
                                    ccy
                                )}
                            </div>
                            <span className='typography-caption-2 h-5 w-full text-neutral-4'>
                                {formatDate(maturityTimestamp)}
                            </span>
                        </div>
                    );
                },
                header: tableHeaderDefinition(
                    'Maturity',
                    'Maturity of a loan contract is the date on which the contract is set to expire.'
                ),
            }),
            futureValueColumnDefinition(
                columnHelper,
                'FV',
                'futureValue',
                row => row.futureValue,
                { color: true, priceList: priceList, compact: false },
                'Future Value (FV) of a loan contract is the obligation value of the contract at time of maturity.'
            ),
            amountColumnDefinition(
                columnHelper,
                'PV',
                'amount',
                row =>
                    isPastDate(Number(row.maturity)) ? undefined : row.amount,
                {
                    color: false,
                    priceList: priceList,
                    compact: false,
                },
                'Present Value (PV) is the current worth of the contract, taking into account the time value of money.'
            ),
            priceYieldColumnDefinition(
                columnHelper,
                'Market Price',
                'marketPrice',
                row =>
                    isPastDate(Number(row.maturity))
                        ? BigInt(10000)
                        : row.marketPrice,
                'default',
                'price',
                'Market Price is the volume-weighted average unit price of filled orders at the last block.'
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const maturity = Number(info.row.original.maturity);
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const amount = BigInt(info.row.original.amount);
                    const absAmount = amount < 0 ? -amount : amount;
                    const side =
                        BigInt(info.row.original.futureValue) < 0
                            ? OrderSide.LEND
                            : OrderSide.BORROW; // side is reversed as unwind
                    if (!ccy) return null;

                    return (
                        <TableActionMenu
                            items={getTableActionMenu(
                                maturity,
                                absAmount,
                                ccy,
                                side
                            )}
                        />
                    );
                },
                header: () => <div className='p-2'>Actions</div>,
            }),
        ],
        [
            delistedCurrencySet,
            getMaturityDisplayValue,
            getTableActionMenu,
            priceList,
            variant,
        ]
    );

    return (
        <>
            <CoreTable
                data={data}
                columns={columns}
                options={{
                    name: 'active-trade-table',
                    stickyFirstColumn: true,
                    pagination: {
                        containerHeight: height || DEFAULT_HEIGHT,
                        getMoreData: () => {},
                        totalData: data.length,
                    },
                }}
                CustomRowComponent={<CompactActiveTradeInfo data={data} />}
            />
            {unwindDialogData && (
                <UnwindDialog
                    isOpen={unwindDialogData.show}
                    onClose={() =>
                        setUnwindDialogData({
                            ...unwindDialogData,
                            show: false,
                        })
                    }
                    maturity={unwindDialogData.maturity}
                    amount={unwindDialogData.amount}
                    side={unwindDialogData.side}
                    type={unwindDialogData.type}
                />
            )}
        </>
    );
};

const formatMaturity = (
    maturityTimeStamp: number,
    timeUnit: 'day' | 'hours' | 'minutes',
    currentTime: number
) => dayjs.unix(maturityTimeStamp).diff(currentTime, timeUnit);
