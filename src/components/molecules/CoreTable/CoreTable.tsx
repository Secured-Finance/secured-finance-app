/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'src/components/atoms';

export interface Pagination {
    getMoreData: () => void;
    totalData: number;
    containerHeight: number | false;
}

type CoreTableOptions = {
    border: boolean;
    name: string;
    onLineClick?: (rowId: string) => void;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
    responsive: boolean;
    stickyFirstColumn?: boolean;
    pagination?: Pagination;
    showHeaders?: boolean;
    compact?: boolean;
    stickyHeader?: boolean;
    isFirstRowLoading?: boolean;
    isLastRowLoading?: boolean;
};

const DEFAULT_OPTIONS: CoreTableOptions = {
    border: true,
    name: 'core-table',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
    responsive: true,
    showHeaders: true,
    compact: false,
    stickyFirstColumn: false,
    stickyHeader: true,
};

const COMPACT_DEFAULT_OPTIONS: CoreTableOptions = {
    border: true,
    name: 'core-table',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
    responsive: true,
    showHeaders: true,
    compact: true,
    stickyFirstColumn: true,
    stickyHeader: true,
};

export const COMPACT_TABLE_DEFAULT_HEIGHT = 300;

const CompactCoreTableSpinner = ({
    height,
}: {
    height: number | undefined;
}) => (
    <div
        className='flex w-full items-center justify-center'
        style={{ height: height || COMPACT_TABLE_DEFAULT_HEIGHT }}
    >
        <Spinner />
    </div>
);

export const CoreTable = <T,>({
    data,
    columns,
    options = DEFAULT_OPTIONS,
}: {
    data: Array<T>;
    columns: ColumnDef<T, any>[];
    options?: Partial<CoreTableOptions>;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const coreTableOptions: CoreTableOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    const [hasMoreData, setHasMoreData] = useState(
        !!coreTableOptions.pagination?.totalData &&
            coreTableOptions.pagination?.totalData > 0
    );

    useEffect(() => {
        if (
            !!coreTableOptions.pagination?.totalData &&
            coreTableOptions.pagination?.totalData > 0
        )
            setHasMoreData(true);
        else {
            setHasMoreData(false);
        }
    }, [coreTableOptions.pagination?.totalData]);

    useEffect(() => {
        if (
            coreTableOptions.pagination?.totalData &&
            data.length >= coreTableOptions.pagination.totalData
        ) {
            setHasMoreData(false);
        }
    }, [coreTableOptions.pagination?.totalData, data]);

    const filteredColumns = columns.filter(column => {
        if (
            coreTableOptions.hideColumnIds === undefined ||
            column.id === undefined
        ) {
            return true;
        }
        return !coreTableOptions.hideColumnIds.includes(column.id);
    });

    const configuration = {
        data: data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    };

    const table = useReactTable<T>(configuration);

    const rows = table.getRowModel().rows;

    const isLoading = (rowIndex: number, dataRows: number) =>
        (options.isFirstRowLoading && rowIndex === 0) ||
        (options.isLastRowLoading && rowIndex === dataRows - 1);

    const coreTable = (
        <table
            className={clsx('w-full', {
                'table-fixed': !coreTableOptions.responsive,
            })}
            data-testid={coreTableOptions.name}
        >
            {coreTableOptions.showHeaders ? (
                <thead
                    className={clsx(
                        'typography-caption-2 px-6 text-slateGray',
                        {
                            'after:absolute after:bottom-0 after:z-20 after:w-full after:border-b after:border-white-10':
                                coreTableOptions.border &&
                                coreTableOptions.stickyHeader,
                            'h-14 py-4': !coreTableOptions.compact,
                            'h-5 py-1': coreTableOptions.compact,
                            'sticky inset-0 z-20 bg-[#1D2739]':
                                coreTableOptions.stickyHeader,
                            'border-b border-white-10':
                                coreTableOptions.border &&
                                !coreTableOptions.stickyHeader,
                        }
                    )}
                >
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            data-testid={`${coreTableOptions.name}-header`}
                        >
                            {headerGroup.headers.map((header, columnIndex) => (
                                <th
                                    data-testid={`${coreTableOptions.name}-header-cell`}
                                    key={header.id}
                                    className={clsx(
                                        'whitespace-nowrap py-2 pr-1 text-center font-bold tablet:px-1',
                                        {
                                            'sticky left-0 z-10 bg-[#161E2E] after:absolute after:-right-4 after:-top-0 after:z-10 after:h-full after:w-5 after:bg-gradient-to-r after:from-black-40 after:to-transparent tablet:relative tablet:left-auto tablet:z-auto tablet:bg-transparent tablet:after:hidden':
                                                coreTableOptions.responsive &&
                                                columnIndex === 0 &&
                                                coreTableOptions?.stickyFirstColumn,
                                        }
                                    )}
                                >
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
            ) : null}

            <tbody>
                {rows.map((row, rowIndex) =>
                    isLoading(rowIndex, rows.length) ? (
                        <tr key={rowIndex} className='animate-pulse'>
                            <td colSpan={row.getVisibleCells().length}>
                                <div className='h-7 min-w-fit bg-[#808080]/20'></div>
                            </td>
                        </tr>
                    ) : (
                        <tr
                            key={row.id}
                            className={clsx('h-7', {
                                'cursor-pointer': coreTableOptions.hoverRow?.(
                                    row.id
                                ),
                                'hover:bg-black-30':
                                    coreTableOptions.hoverRow?.(row.id),
                                'border-b border-white-10':
                                    coreTableOptions.border &&
                                    rowIndex !==
                                        table.getRowModel().rows.length - 1,
                            })}
                            onClick={() =>
                                coreTableOptions.hoverRow?.(row.id) &&
                                coreTableOptions.onLineClick?.(row.id)
                            }
                            data-testid={`${coreTableOptions.name}-row`}
                        >
                            {row.getVisibleCells().map((cell, cellIndex) => (
                                <td
                                    key={cell.id}
                                    className={clsx(
                                        'min-w-fit whitespace-nowrap pr-1 text-center font-medium tablet:px-1',
                                        {
                                            'sticky left-0 z-10 bg-[#161E2E] after:absolute after:-right-4 after:-top-0 after:z-10 after:h-full after:w-5 after:bg-gradient-to-r after:from-black-40 after:to-transparent tablet:relative tablet:left-auto tablet:z-auto tablet:bg-transparent tablet:after:hidden':
                                                coreTableOptions.responsive &&
                                                cellIndex === 0 &&
                                                coreTableOptions?.stickyFirstColumn,
                                            'py-2': !coreTableOptions.compact,
                                            'py-1': coreTableOptions.compact,
                                        }
                                    )}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );

    const fetchMoreData = () => {
        if (data.length > 0) {
            coreTableOptions?.pagination?.getMoreData();
        }
    };

    return (
        <div
            className={clsx({
                'overflow-x-auto overflow-y-visible text-white laptop:overflow-visible':
                    coreTableOptions.responsive,
            })}
        >
            <PaginatedScrolling
                data={data}
                fetchMoreData={fetchMoreData}
                hasMoreData={hasMoreData}
                containerHeight={
                    coreTableOptions?.pagination?.containerHeight
                        ? coreTableOptions.pagination.containerHeight
                        : undefined
                }
            >
                {coreTable}
            </PaginatedScrolling>
        </div>
    );
};

export const CompactCoreTable = <T,>({
    data,
    columns,
    options = COMPACT_DEFAULT_OPTIONS,
    isLoading = false,
}: {
    data: Array<T>;
    columns: ColumnDef<T, any>[];
    options?: Partial<CoreTableOptions>;
    isLoading?: boolean;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const coreTableOptions: CoreTableOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    const [hasMoreData, setHasMoreData] = useState(
        !!coreTableOptions.pagination?.totalData &&
            coreTableOptions.pagination?.totalData > 0
    );

    useEffect(() => {
        if (
            !!coreTableOptions.pagination?.totalData &&
            coreTableOptions.pagination?.totalData > 0
        )
            setHasMoreData(true);
        else {
            setHasMoreData(false);
        }
    }, [coreTableOptions.pagination?.totalData]);

    useEffect(() => {
        if (
            coreTableOptions.pagination?.totalData &&
            data.length >= coreTableOptions.pagination.totalData
        ) {
            setHasMoreData(false);
        }
    }, [coreTableOptions.pagination?.totalData, data]);

    const filteredColumns = columns.filter(column => {
        if (
            coreTableOptions.hideColumnIds === undefined ||
            column.id === undefined
        ) {
            return true;
        }
        return !coreTableOptions.hideColumnIds.includes(column.id);
    });

    const configuration = {
        data: data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    };

    const table = useReactTable<T>(configuration);

    const rows = table.getRowModel().rows;

    const coreTable = (
        <table
            className={clsx('w-full', {
                'table-fixed': !coreTableOptions.responsive,
            })}
            data-testid={coreTableOptions.name}
        >
            {coreTableOptions.showHeaders ? (
                <thead
                    className={clsx(
                        'sticky inset-0 z-20 h-8 bg-neutral-900 py-1.5 text-2.5 leading-5 text-neutral-300 after:absolute after:bottom-0 after:z-20 after:w-full after:border-b after:border-neutral-600'
                    )}
                >
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            data-testid={`${coreTableOptions.name}-header`}
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    data-testid={`${coreTableOptions.name}-header-cell`}
                                    key={header.id}
                                    className='whitespace-nowrap text-center font-normal tablet:px-2'
                                >
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
            ) : null}

            <tbody>
                {rows.map((row, index) => (
                    <tr
                        key={row.id}
                        data-testid={`${coreTableOptions.name}-row`}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td
                                key={cell.id}
                                className={clsx(
                                    'min-w-fit whitespace-nowrap px-4 pb-1 text-center font-medium',
                                    {
                                        'pt-2': index === 0,
                                        'pt-0': index !== 0,
                                    }
                                )}
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
    );

    const fetchMoreData = () => {
        if (data.length > 0) {
            coreTableOptions?.pagination?.getMoreData();
        }
    };

    const containerHeight = coreTableOptions?.pagination?.containerHeight
        ? coreTableOptions.pagination.containerHeight
        : undefined;

    return (
        <div
            className={clsx({
                'overflow-x-auto overflow-y-visible text-white laptop:overflow-visible':
                    coreTableOptions.responsive,
            })}
        >
            {isLoading ? (
                <CompactCoreTableSpinner height={containerHeight} />
            ) : (
                <PaginatedScrolling
                    data={data}
                    fetchMoreData={fetchMoreData}
                    hasMoreData={hasMoreData}
                    containerHeight={containerHeight}
                >
                    {coreTable}
                </PaginatedScrolling>
            )}
        </div>
    );
};

const PaginatedScrolling = ({
    children,
    data,
    fetchMoreData,
    hasMoreData,
    containerHeight,
}: {
    children: React.ReactNode;
    data: Array<any>;
    fetchMoreData: () => void;
    hasMoreData: boolean;
    containerHeight?: number;
}) => (
    <InfiniteScroll
        // This is required for tables who do not have pagination. This also allows us to scroll the table easily in tests.
        height={containerHeight}
        style={{
            overflow: `${containerHeight ? 'auto' : 'visible'}`,
            paddingBottom: `${containerHeight ? '20px' : '0px'}`,
        }}
        dataLength={data.length}
        next={fetchMoreData}
        hasMore={hasMoreData}
        className={'scrollbar-table'}
        loader={<h4>Loading...</h4>}
    >
        {children}
    </InfiniteScroll>
);
