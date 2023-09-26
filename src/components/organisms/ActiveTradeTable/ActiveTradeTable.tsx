import { OrderSide } from '@secured-finance/sf-client';
import { formatDate } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
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
import { hexToCurrencySymbol } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    forwardValueColumnDefinition,
    loanTypeFromFVColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';
import ErrorIcon from 'src/assets/icons/error.svg';
import { Separator } from 'src/components/atoms';

const columnHelper = createColumnHelper<Position>();

export const ActiveTradeTable = ({ data }: { data: Position[] }) => {
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        show: boolean;
    }>();
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const router = useRouter();
    const dispatch = useDispatch();
    const isTablet = useBreakpoint('laptop');

    const columns = useMemo(
        () => [
            loanTypeFromFVColumnDefinition(columnHelper, 'Type', 'side'),
            contractColumnDefinition(columnHelper, 'Contract', 'contract'),
            columnHelper.accessor('maturity', {
                cell: info => {
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
                    if (dayToMaturity > 1) {
                        maturity = `${dayToMaturity} Days`;
                    } else if (dayToMaturity === 1) {
                        maturity = `${dayToMaturity} Day`;
                    } else if (dayToMaturity < 1) {
                        maturity = (
                            <>
                                {diffHours > 0 ? (
                                    <span className='mx-1'>{diffHours}h</span>
                                ) : null}
                                {diffMinutes > 0 ? <>{diffMinutes}m</> : null}
                            </>
                        );
                    }
                    return (
                        <div className='grid w-40 justify-center tablet:w-full'>
                            <div className='typography-caption w-full text-neutral-7'>
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
                                        text: 'Unwind Position',
                                        onClick: () => {
                                            setUnwindDialogData({
                                                maturity: new Maturity(
                                                    maturity
                                                ),
                                                amount: new Amount(amount, ccy),
                                                show: true,
                                                side: side,
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
        [dispatch, priceList, router]
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <div className='pb-2'>
            <CoreTable
                data={data}
                columns={isTablet ? columnsForTabletMobile : columns}
                options={{
                    name: 'active-trade-table',
                    stickyColumns: new Set<number>([6]),
                }}
            />
            <div className='typography-dropdown-selection-label mt-16 w-full rounded-xl bg-cardBackground/60 text-justify text-secondary7 '>
                <div className='flex p-3'>
                    <ErrorIcon className='mr-1 h-4 w-4' />
                    <p>
                        <span className='flex text-red'>
                            Delisting Contracts
                        </span>
                        - Auto-rolls will cease after the contract&apos;s
                        maturity date. Borrowers are recommended to repay within
                        7 days following maturity to avoid any fees (7% penalty
                        will be applied for non-repayment). Lenders can redeem
                        their funds 7 days after the maturity date. Be aware
                        that some order books might take up to 2 years to fully
                        mature. It&apos;s crucial to act promptly to prevent any
                        penalties. Learn More
                    </p>
                </div>

                <Separator color='neutral-3'></Separator>
                <p className='p-3'>
                    Secured Finance lending contract includes an auto-roll
                    feature. If no action is taken by the user prior to the
                    contract&apos;s maturity date, it will automatically roll
                    over into the next closest expiration date. This convenience
                    comes with a 0.25% fee for the auto-roll transaction.{' '}
                </p>
                <p className='p-3'>
                    It is the user&apos;s responsibility to take action to
                    unwind the contract prior to its maturity date. Failure to
                    do so will result in the contract being automatically rolled
                    over, incurring the aforementioned fee.
                </p>
            </div>
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
                />
            )}
        </div>
    );
};

const formatMaturity = (
    maturityTimeStamp: number,
    timeUnit: 'day' | 'hours' | 'minutes',
    currentTime: number
) => dayjs.unix(maturityTimeStamp).diff(currentTime, timeUnit);
