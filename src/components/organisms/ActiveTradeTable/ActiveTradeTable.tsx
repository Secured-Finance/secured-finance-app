import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import * as dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { UnwindDialog, UnwindDialogType } from 'src/components/organisms';
import { Position, useBreakpoint, useLastPrices } from 'src/hooks';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import {
    CurrencySymbol,
    hexToCurrencySymbol,
    isMaturityPastDays,
    isPastDate,
} from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    forwardValueColumnDefinition,
    loanTypeFromFVColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<
    Position & { underMinimalCollateral?: boolean }
>();

const DEFAULT_HEIGHT = 300;

export const ActiveTradeTable = ({
    data,
    delistedCurrencySet,
    height,
}: {
    data: (Position & { underMinimalCollateral?: boolean })[];
    delistedCurrencySet: Set<CurrencySymbol>;
    height?: number;
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

    const getTableActionMenu = useCallback(
        (
            maturity: number,
            amount: bigint,
            ccy: CurrencySymbol,
            side: OrderSide
        ) => {
            const items = [
                {
                    text: 'Add/Reduce Position',
                    onClick: (): void => {
                        dispatch(setMaturity(maturity));
                        dispatch(setCurrency(ccy));
                        router.push('/advanced/');
                    },
                },
                {
                    text: 'Unwind Position',
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

            let label = 'Unwind Position';
            let type: UnwindDialogType;
            let disableAction;

            if (delistedCurrencySet.has(ccy)) {
                if (side === OrderSide.LEND) {
                    label = 'Repay Position';
                    type = 'REPAY';
                } else {
                    label = 'Redeem Position';
                    type = 'REDEEM';
                    if (!isMaturityPastDays(maturity, 7)) {
                        disableAction = true;
                    }
                }
            }

            return [
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
        [delistedCurrencySet, dispatch, router]
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
                'default',
                delistedCurrencySet
            ),
            columnHelper.accessor('maturity', {
                cell: info => {
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const maturityTimestamp = Number(info.getValue());

                    const side =
                        BigInt(info.row.original.forwardValue) < 0
                            ? OrderSide.BORROW
                            : OrderSide.LEND;

                    return (
                        <div className='grid w-40 justify-center tablet:w-full'>
                            <div
                                className={classNames(
                                    'typography-caption w-full',
                                    {
                                        'text-galacticOrange':
                                            ccy && delistedCurrencySet.has(ccy),
                                        'text-neutral7':
                                            ccy &&
                                            !delistedCurrencySet.has(ccy),
                                    }
                                )}
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
            forwardValueColumnDefinition(
                columnHelper,
                'FV',
                'forwardValue',
                row => row.forwardValue,
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
                        BigInt(info.row.original.forwardValue) < 0
                            ? OrderSide.LEND
                            : OrderSide.BORROW; // side is reversed as unwind
                    if (!ccy) return null;

                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={getTableActionMenu(
                                    maturity,
                                    absAmount,
                                    ccy,
                                    side
                                )}
                            />
                        </div>
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
        ]
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <>
            <CoreTable
                data={data}
                columns={isTablet ? columnsForTabletMobile : columns}
                options={{
                    name: 'active-trade-table',
                    stickyColumns: new Set<number>([6]),
                    pagination: {
                        containerHeight: height || DEFAULT_HEIGHT,
                        getMoreData: () => {},
                        totalData: data.length,
                    },
                }}
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
