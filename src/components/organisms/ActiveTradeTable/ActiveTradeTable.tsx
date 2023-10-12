import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import * as dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { UnwindDialog } from 'src/components/organisms';
import { Position, useBreakpoint } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, hexToCurrencySymbol } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    forwardValueColumnDefinition,
    loanTypeFromFVColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Position>();

const DEFAULT_HEIGHT = 300;

export const ActiveTradeTable = ({
    data,
    currencyDelistedStatusMap,
    height,
}: {
    data: Position[];
    currencyDelistedStatusMap: Record<CurrencySymbol, boolean>;
    height?: number;
}) => {
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        show: boolean;
        type: 'UNWIND' | 'REDEEM' | 'REPAY';
    }>();
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const router = useRouter();
    const dispatch = useDispatch();
    const isTablet = useBreakpoint('laptop');

    const columns = useMemo(
        () => [
            loanTypeFromFVColumnDefinition(columnHelper, 'Type', 'side'),
            contractColumnDefinition(
                columnHelper,
                'Contract',
                'contract',
                'default',
                currencyDelistedStatusMap
            ),
            columnHelper.accessor('maturity', {
                cell: info => {
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const currentTime = Date.now();
                    const maturityTimestamp = Number(info.getValue());
                    const dayToMaturity = formatMaturity(
                        maturityTimestamp,
                        'day',
                        currentTime
                    );
                    const diffHours = formatMaturity(
                        maturityTimestamp,
                        'hours',
                        currentTime
                    );
                    const diffMinutes =
                        formatMaturity(
                            maturityTimestamp,
                            'minutes',
                            currentTime
                        ) % 60;
                    let maturity;
                    if (dayToMaturity > 1 || dayToMaturity < 0) {
                        maturity = (
                            <span className='mx-1'>{dayToMaturity} Days</span>
                        );
                    } else if (dayToMaturity === 1) {
                        maturity = `${dayToMaturity} Day`;
                    } else {
                        maturity = (
                            <div>
                                {diffHours !== 0 && (
                                    <span className='mx-1'>{diffHours}h</span>
                                )}
                                {diffMinutes !== 0 && (
                                    <span>{diffMinutes}m</span>
                                )}
                            </div>
                        );
                    }
                    return (
                        <div className='grid w-40 justify-center tablet:w-full'>
                            <div
                                className={classNames(
                                    'typography-caption w-full',
                                    {
                                        'text-galacticOrange':
                                            ccy &&
                                            currencyDelistedStatusMap[ccy],
                                        'text-neutral7':
                                            ccy &&
                                            !currencyDelistedStatusMap[ccy],
                                    }
                                )}
                            >
                                {maturity}
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
                row => row.amount,
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
                row => row.marketPrice,
                'default',
                'price',
                'Market Price is the volume-weighted average unit price of filled orders at the last block.'
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const maturity = Number(info.row.original.maturity);
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const amount = BigNumber.from(
                        info.row.original.amount
                    ).abs();
                    const side = BigNumber.from(
                        info.row.original.forwardValue
                    ).isNegative()
                        ? OrderSide.LEND
                        : OrderSide.BORROW; // side is reversed as unwind
                    if (!ccy) return null;
                    const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;

                    const calculateTimeDifference = (timestamp: number) => {
                        const targetDate = new Date(timestamp * 1000);
                        const currentDate = new Date();
                        return currentDate.getTime() - targetDate.getTime();
                    };

                    const isRepaymentPeriod = (maturity: number) => {
                        return (
                            Math.abs(calculateTimeDifference(maturity)) <=
                            millisecondsInAWeek
                        );
                    };

                    const isRedemptionPeriod = (maturity: number) => {
                        return (
                            calculateTimeDifference(maturity) >=
                            millisecondsInAWeek
                        );
                    };
                    let type: 'UNWIND' | 'REPAY' | 'REDEEM' = 'UNWIND';
                    let label = 'Unwind Position';
                    if (currencyDelistedStatusMap[ccy]) {
                        if (
                            side === OrderSide.BORROW &&
                            isRedemptionPeriod(maturity)
                        ) {
                            type = 'REDEEM';
                            label = 'Redeem Position';
                        }
                        if (
                            side === OrderSide.LEND &&
                            isRepaymentPeriod(maturity)
                        ) {
                            label = 'Repay Position';
                            type = 'REPAY';
                        }
                    }
                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'Add/Reduce Position',
                                        onClick: () => {
                                            dispatch(setMaturity(maturity));
                                            dispatch(setCurrency(ccy));
                                            router.push('/advanced/');
                                        },
                                    },
                                    {
                                        text: label,
                                        onClick: () => {
                                            setUnwindDialogData({
                                                maturity: new Maturity(
                                                    maturity
                                                ),
                                                amount: new Amount(amount, ccy),
                                                show: true,
                                                side: side,
                                                type: type,
                                            });
                                        },
                                    },
                                ]}
                            />
                        </div>
                    );
                },
                header: () => <div className='p-2'>Actions</div>,
            }),
        ],
        [currencyDelistedStatusMap, dispatch, priceList, router]
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
