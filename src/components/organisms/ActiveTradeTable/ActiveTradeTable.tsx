import { createColumnHelper } from '@tanstack/react-table';
import * as dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chip, CurrencyItem, PriceYieldItem } from 'src/components/atoms';
import {
    CoreTable,
    TableContractCell,
    TableHeader,
} from 'src/components/molecules';
import { ContractDetailDialog } from 'src/components/organisms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { TradeHistory } from 'src/types';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { hexToString } from 'web3-utils';

const columnHelper = createColumnHelper<TradeHistory[0]>();

export const ActiveTradeTable = ({ data }: { data: TradeHistory }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const columns = useMemo(
        () => [
            columnHelper.accessor('side', {
                cell: info => (
                    <div className='flex justify-center'>
                        <Chip
                            label={
                                info.getValue().toString() === '1'
                                    ? 'Borrow'
                                    : 'Lend'
                            }
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Type'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('maturity', {
                id: 'contract',
                cell: info => (
                    <div className='flex justify-center'>
                        <TableContractCell
                            maturity={info.getValue()}
                            ccyByte32={info.row.original.currency}
                        />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Contract'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('maturity', {
                cell: info => {
                    const dayToMaturity = dayjs
                        .unix(info.getValue())
                        .diff(Date.now(), 'day');

                    return <>{dayToMaturity} Days</>;
                },
                header: header => (
                    <TableHeader
                        title='D.T.M.'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('forwardValue', {
                cell: info => {
                    const ccy = hexToString(
                        info.row.original.currency
                    ) as CurrencySymbol;

                    return (
                        <div className='flex justify-end'>
                            <CurrencyItem
                                amount={currencyMap[ccy].fromBaseUnit(
                                    info.getValue()
                                )}
                                ccy={ccy}
                                price={priceList[ccy]}
                                align='right'
                                color={
                                    info.row.original.side === 1
                                        ? 'negative'
                                        : 'positive'
                                }
                            />
                        </div>
                    );
                },
                header: header => (
                    <TableHeader
                        title='F.V.'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('averagePrice', {
                cell: info => {
                    return (
                        <div className='flex justify-center'>
                            <PriceYieldItem
                                loanValue={LoanValue.fromPrice(
                                    Number(info.getValue().toString()),
                                    Number(
                                        info.row.original.maturity.toString()
                                    )
                                )}
                            />
                        </div>
                    );
                },
                header: header => (
                    <TableHeader
                        title='M.T.M'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('amount', {
                cell: info => {
                    const ccy = hexToString(
                        info.row.original.currency
                    ) as CurrencySymbol;

                    return (
                        <div className='flex justify-end'>
                            <CurrencyItem
                                amount={currencyMap[ccy].fromBaseUnit(
                                    info.getValue()
                                )}
                                ccy={ccy}
                                price={priceList[ccy]}
                                align='right'
                            />
                        </div>
                    );
                },
                header: header => (
                    <TableHeader
                        title='P.V.'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.display({
                id: 'actions',
                cell: () => <div>...</div>,
                header: () => <div>Actions</div>,
            }),
        ],
        [priceList]
    );

    const [displayContractDetails, setDisplayContractDetails] = useState(false);
    return (
        <div className='pb-2'>
            <CoreTable
                data={data}
                columns={columns}
                name='active-trade-table'
                border
                onLineClick={() => setDisplayContractDetails(true)}
            />
            <ContractDetailDialog
                isOpen={displayContractDetails}
                onClose={() => setDisplayContractDetails(false)}
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
