/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Pagination } from 'src/types';

type CoreTableOptions = {
    border: boolean;
    name: string;
    onLineClick?: (rowId: string) => void;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
    responsive: boolean;
    stickyColumns?: Set<number>;
    pagination?: Pagination;
    showHeaders?: boolean;
};

const DEFAULT_OPTIONS: CoreTableOptions = {
    border: true,
    name: 'core-table',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
    responsive: true,
    showHeaders: true,
};

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

    const lastColumnIndex = filteredColumns.length - 1;

    const stickyClass: Record<number, string> = {
        0: 'left-0 tablet:left-auto',
        1: 'left-1/3 tablet:left-auto',
        [lastColumnIndex]: 'right-0 tablet:right-auto',
    };

    const coreTable = (
        <table
            className={classNames('w-full', {
                'table-fixed': !coreTableOptions.responsive,
            })}
            data-testid={coreTableOptions.name}
        >
            {coreTableOptions.showHeaders ? (
                <thead
                    className={classNames(
                        'typography-caption-2 h-14 px-6 py-4 text-slateGray',
                        {
                            'border-b border-white-10': coreTableOptions.border,
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
                                    className={classNames(
                                        'whitespace-nowrap py-2 pr-1 text-center font-bold tablet:px-1',
                                        {
                                            'sticky z-10 bg-gunMetal/100 tablet:relative tablet:bg-transparent':
                                                coreTableOptions.responsive &&
                                                coreTableOptions?.stickyColumns?.has(
                                                    columnIndex
                                                ),
                                            [stickyClass[columnIndex]]:
                                                coreTableOptions.responsive &&
                                                coreTableOptions.stickyColumns?.has(
                                                    columnIndex
                                                ),
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
                {table.getRowModel().rows.map(row => (
                    <tr
                        key={row.id}
                        className={classNames('h-7', {
                            'cursor-pointer': coreTableOptions.hoverRow?.(
                                row.id
                            ),
                            'hover:bg-black-30': coreTableOptions.hoverRow?.(
                                row.id
                            ),
                            'border-b border-white-10': coreTableOptions.border,
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
                                className={classNames(
                                    'min-w-fit whitespace-nowrap py-2 pr-1 text-center font-medium tablet:px-1',
                                    {
                                        'sticky z-10 bg-gunMetal/100 tablet:relative tablet:z-auto tablet:bg-transparent':
                                            coreTableOptions.responsive &&
                                            coreTableOptions?.stickyColumns?.has(
                                                cellIndex
                                            ),
                                        [stickyClass[cellIndex]]:
                                            coreTableOptions.responsive &&
                                            coreTableOptions.stickyColumns?.has(
                                                cellIndex
                                            ),
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
        coreTableOptions?.pagination?.getMoreData();
    };

    return (
        <div
            className={classNames({
                'overflow-x-auto overflow-y-visible text-white laptop:overflow-visible':
                    coreTableOptions.responsive,
            })}
        >
            <PaginatedScrolling
                data={data}
                fetchMoreData={fetchMoreData}
                hasMoreData={hasMoreData}
                containerHeight={
                    !!coreTableOptions?.pagination?.containerHeight
                }
            >
                {coreTable}
            </PaginatedScrolling>
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
    containerHeight?: boolean;
}) => (
    <InfiniteScroll
        // This is required for tables who do not have pagination. This also allows us to scroll the table easily in tests.
        height={containerHeight ? 300 : undefined}
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
