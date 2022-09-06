import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortDirection,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowDownUp from 'src/assets/icons/arrows-down-up.svg';
import ChevronDown from 'src/assets/icons/ChevronDown.svg';
import { Chip, CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { ContractDetailDialog } from 'src/components/organisms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, percentFormat } from 'src/utils';

export enum Position {
    Borrow = 'Borrow',
    Lend = 'Lend',
}

type ActiveTrade = {
    position: Position;
    contract: string;
    apy: number;
    notional: number;
    currency: CurrencySymbol;
    presentValue: number;
    dayToMaturity: number;
    forwardValue: number;
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
            {!isSorted && (
                <span>
                    <ArrowDownUp className='h-4 w-4' />
                </span>
            )}
            {isSorted && (
                <span>
                    <ChevronDown
                        className={classNames('h-4 w-4', {
                            'rotate-180': isSorted === 'desc',
                        })}
                    />
                </span>
            )}
        </span>
    </button>
);

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
                cell: info => percentFormat(info.getValue(), 1),
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
                        <CurrencyItem
                            ccy={ccy}
                            amount={info.getValue()}
                            price={priceList[ccy]}
                            align='right'
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
                        <CurrencyItem
                            ccy={ccy}
                            amount={info.getValue()}
                            price={priceList[ccy]}
                            align='right'
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
