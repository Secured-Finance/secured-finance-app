import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortDirection,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Chip,
    CurrencyIcon,
    CurrencyItem,
    SortArrows,
} from 'src/components/atoms';
import { ContractDetailDialog } from 'src/components/organisms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { currencyMap, CurrencySymbol, Rate } from 'src/utils';

export type ActiveTrade = {
    position: 'Borrow' | 'Lend';
    contract: string;
    apy: Rate;
    notional: BigNumber;
    currency: CurrencySymbol;
    presentValue: BigNumber;
    dayToMaturity: number;
    forwardValue: BigNumber;
};

const columnHelper = createColumnHelper<ActiveTrade>();

const TableHeader = ({
    title,
    sortingHandler,
    isSorted,
}: {
    title: string;
    sortingHandler: ((event: unknown) => void) | undefined;
    isSorted: boolean | SortDirection;
}) => (
    <button className='cursor-pointer select-none' onClick={sortingHandler}>
        <span className='flex flex-row items-center justify-center gap-1'>
            <span>{title}</span>
            <span>
                <SortArrows isSorted={isSorted} />
            </span>
        </span>
    </button>
);

const AmountCell = ({
    ccy,
    amount,
    priceList,
}: {
    ccy: CurrencySymbol;
    amount: BigNumber;
    priceList: Record<CurrencySymbol, number>;
}) => {
    return (
        <CurrencyItem
            ccy={ccy}
            amount={currencyMap[ccy].fromBaseUnit(amount)}
            price={priceList[ccy]}
            align='right'
        />
    );
};

export const ActiveTradeTable = ({ data }: { data: Array<ActiveTrade> }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const columns = useMemo(
        () => [
            columnHelper.accessor('position', {
                cell: info => (
                    <div className='flex justify-center'>
                        <Chip label={info.getValue()} />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Position'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('contract', {
                cell: info => info.getValue(),
                header: header => (
                    <TableHeader
                        title='Contract'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('apy', {
                cell: info => info.getValue().toPercent(),
                header: header => (
                    <TableHeader
                        title='APY'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('currency', {
                cell: info => (
                    <div className='flex justify-center'>
                        <CurrencyIcon ccy={info.getValue()} />
                    </div>
                ),
                header: () => '',
            }),
            columnHelper.accessor('presentValue', {
                cell: info => {
                    const ccy = info.row.original.currency;
                    return (
                        <AmountCell
                            ccy={ccy}
                            amount={info.getValue()}
                            priceList={priceList}
                        />
                    );
                },

                header: header => (
                    <TableHeader
                        title='Present Value'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('dayToMaturity', {
                cell: info => `${info.getValue()} Days`,
                header: header => (
                    <TableHeader
                        title='DTM'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('forwardValue', {
                cell: info => {
                    const ccy = info.row.original.currency;
                    return (
                        <AmountCell
                            ccy={ccy}
                            amount={info.getValue()}
                            priceList={priceList}
                        />
                    );
                },
                header: header => (
                    <TableHeader
                        title='Forward Value'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
        ],
        [priceList]
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const [displayContractDetails, setDisplayContractDetails] = useState(false);
    return (
        <>
            <table className='w-full text-white'>
                <thead className='typography-caption-2 h-14  border-b border-white-10 py-4 px-6 text-slateGray'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className='cursor-pointer'
                            onClick={() => setDisplayContractDetails(true)}
                            data-testid='active-trade-row'
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className='px-4 py-2 text-center'
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ContractDetailDialog
                isOpen={displayContractDetails}
                onClose={() => setDisplayContractDetails(false)}
            />
        </>
    );
};
