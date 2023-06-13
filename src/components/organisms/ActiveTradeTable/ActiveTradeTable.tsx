import { formatDate } from '@secured-finance/sf-core';
import { createColumnHelper } from '@tanstack/react-table';
import * as dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { UnwindDialog } from 'src/components/organisms';
import { useBreakpoint, Positions, Position } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { hexToCurrencySymbol } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeFromAmountColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Position>();

export const ActiveTradeTable = ({ data }: { data: Positions }) => {
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        show: boolean;
    }>();
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const router = useRouter();
    const dispatch = useDispatch();
    const isTablet = useBreakpoint('tablet');

    const columns = useMemo(
        () => [
            loanTypeFromAmountColumnDefinition(columnHelper, 'Type', 'side'),
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
                    'D.T.M.',
                    'Days to Maturity (DTM) of a loan contract is the date on which the contract is set to expire.'
                ),
            }),
            amountColumnDefinition(
                columnHelper,
                'F.V',
                'forwardValue',
                row => row.forwardValue,
                { color: true, priceList: priceList, compact: false },
                'Future Value (F.V) of a loan contract is the obligation value of the contract at time of maturity.'
            ),
            amountColumnDefinition(
                columnHelper,
                'P.V',
                'amount',
                row => row.amount,
                {
                    color: false,
                    priceList: priceList,
                    compact: false,
                },
                'Present Value (P.V) is the current worth of the contract, taking into account the time value of money.'
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const maturity = new Maturity(info.row.original.maturity);
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const amount = BigNumber.from(info.row.original.amount);
                    if (!ccy) return null;
                    return (
                        <div className='relative flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'View Contract',
                                        onClick: () => {},
                                        disabled: true,
                                    },
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
                                                maturity,
                                                amount: new Amount(amount, ccy),
                                                show: true,
                                            });
                                        },
                                    },
                                ]}
                            />
                        </div>
                    );
                },
                header: () => <div>Actions</div>,
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
                options={{ name: 'active-trade-table' }}
            />
            <div className='typography-dropdown-selection-label mt-16 w-full rounded-xl bg-cardBackground/60 text-justify text-secondary7 '>
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
