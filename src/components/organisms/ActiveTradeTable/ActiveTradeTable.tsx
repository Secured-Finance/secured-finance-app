import { createColumnHelper } from '@tanstack/react-table';
import * as dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { UnwindDialog } from 'src/components/organisms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { hexToCurrencySymbol, TradeSummary } from 'src/utils';
import { Amount, Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeFromAmountColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<TradeSummary>();

export const ActiveTradeTable = ({ data }: { data: TradeSummary[] }) => {
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        show: boolean;
    }>();
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const router = useRouter();
    const dispatch = useDispatch();

    const columns = useMemo(
        () => [
            loanTypeFromAmountColumnDefinition(columnHelper, 'Type', 'side'),
            contractColumnDefinition(columnHelper, 'Contract', 'contract'),
            columnHelper.accessor('maturity', {
                cell: info => {
                    const dayToMaturity = dayjs
                        .unix(Number(info.getValue()))
                        .diff(Date.now(), 'day');

                    return <>{dayToMaturity} Days</>;
                },
                header: tableHeaderDefinition('D.T.M.'),
            }),
            amountColumnDefinition(
                columnHelper,
                'F.V',
                'forwardValue',
                row => row.forwardValue,
                { color: true, priceList: priceList, compact: false }
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
                }
            ),
            priceYieldColumnDefinition(
                columnHelper,
                'M.T.M.',
                'averagePrice',
                row => row.averagePrice
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const maturity = new Maturity(info.row.original.maturity);
                    const ccy = hexToCurrencySymbol(info.row.original.currency);
                    const amount = BigNumber.from(info.row.original.amount);
                    if (!ccy) return null;
                    return (
                        <div className='flex justify-center'>
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

    return (
        <div className='pb-2'>
            <CoreTable
                data={data}
                columns={columns}
                name='active-trade-table'
                border
            />
            <div className='typography-dropdown-selection-label mx-10 my-6 bg-cardBackground/60 text-justify text-secondary7 '>
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
