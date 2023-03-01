import { createColumnHelper } from '@tanstack/react-table';
import * as dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { TradeSummary } from 'src/utils';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeFromAmountColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<TradeSummary>();

export const ActiveTradeTable = ({ data }: { data: TradeSummary[] }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const router = useRouter();

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
            priceYieldColumnDefinition(
                columnHelper,
                'M.T.M.',
                'averagePrice',
                row => row.averagePrice
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
            columnHelper.display({
                id: 'actions',
                cell: () => (
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
                                        router.push('/advanced/');
                                    },
                                },
                                { text: 'Unwind Position', onClick: () => {} },
                            ]}
                        />
                    </div>
                ),
                header: () => <div>Actions</div>,
            }),
        ],
        [priceList, router]
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
                    contract&apos;s maturation date, it will automatically roll
                    over into the next closest expiration date. This convenience
                    comes with a 0.25% fee for the auto-roll transaction.{' '}
                </p>
                <p className='p-3'>
                    It is the user&apos;s responsibility to take action to
                    unwind the contract prior to its maturation date. Failure to
                    do so will result in the contract being automatically rolled
                    over, incurring the aforementioned fee.
                </p>
            </div>
        </div>
    );
};
