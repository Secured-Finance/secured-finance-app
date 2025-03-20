/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { OrderBookInfo } from 'src/components/atoms';
import { calculateAveragePrice, calculateFutureValue } from 'src/utils';

type CoreTableOptions = {
    name: string;
    hoverDirection: 'up' | 'down';
    onLineClick?: (rowId: string) => void;
    hoverRow?: (rowId: string) => boolean;
    hideColumnIds?: string[];
    showHeaders?: boolean;
    isFirstRowLoading?: boolean;
    isLastRowLoading?: boolean;
};

const DEFAULT_OPTIONS: CoreTableOptions = {
    name: 'core-table',
    hoverDirection: 'up',
    onLineClick: undefined,
    hoverRow: undefined,
    hideColumnIds: undefined,
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
    const [activeRow, setActiveRow] = useState<string>();
    const [orderBookInfoData, setOrderBookInfoData] = useState<{
        avgPrice: number;
        avgApr: number;
        totalAmount: number;
        totalUsd: number;
        position: { top: number; left: number };
    } | null>(null);

    const coreTableOptions: CoreTableOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const onHoverBackground = useCallback(
        (rowId: string) => {
            if (coreTableOptions.hoverDirection === 'up') {
                return activeRow && Number(rowId) >= Number(activeRow);
            } else if (coreTableOptions.hoverDirection === 'down') {
                return activeRow && Number(rowId) <= Number(activeRow);
            }
        },
        [activeRow, coreTableOptions.hoverDirection]
    );

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

    useEffect(() => {
        const handleScroll = () => {
            setOrderBookInfoData(null);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMouseEnter = (
        event: MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>,
        row: Row<T>
    ) => {
        setActiveRow(row.id);
        const rowData = row.original as any;
        const firstCell = event.currentTarget.querySelector('td');
        if (!firstCell) return;

        const rect = firstCell.getBoundingClientRect();
        const top = rect.top + rect.height / 2;
        const left = rect.left;

        const currentDate = new Date();
        const currentUnix = Math.floor(currentDate.getTime() / 1000);

        const maturityUnix = rowData.value._maturity;
        const secondsToMaturity = maturityUnix - currentUnix;
        const daysToMaturity =
            secondsToMaturity > 0 ? secondsToMaturity / (60 * 60 * 24) : 0;

        let orderBookInfo = {
            avgPrice: calculateAveragePrice(BigInt(rowData?.value?._price)),
            avgApr: rowData?.value?._apr?.rate / 10000,
            totalUsd: Number(rowData?.amount) / rowData?.value?.PAR_VALUE_RATE,
            totalAmount: Number(rowData?.cumulativeAmount) / 1000000,
            position: { top, left },
        };

        if (rowData.amount > 0) {
            const hoveredRowIndex = rows.findIndex(r => r.id === row.id);
            let relevantRows: any[];

            const isBuyTable = options.name === 'sellOrders';
            if (isBuyTable) {
                relevantRows = rows
                    .slice(0, hoveredRowIndex + 1)
                    .map(r => r.original as any)
                    .filter(r => r.amount > 0);
            } else {
                relevantRows = rows
                    .slice(hoveredRowIndex, rows.length)
                    .map(r => r.original as any)
                    .filter(r => r.amount > 0);
            }

            if (relevantRows.length > 0) {
                let totalFVAmount = BigInt(0);
                let totalPVAmount = BigInt(0);

                relevantRows.forEach(order => {
                    const amount = BigInt(order.amount);
                    const unitPrice = BigInt(order.value._price);
                    const fvAmount = calculateFutureValue(amount, unitPrice);

                    totalFVAmount += fvAmount;
                    totalPVAmount += amount;
                });

                const avgPrice = Number(totalPVAmount) / Number(totalFVAmount);
                const vwap = avgPrice * 100;
                const avgApr =
                    daysToMaturity > 0
                        ? (100 / vwap - 1) * (365 / daysToMaturity)
                        : 0;

                const totalUsd =
                    Number(totalPVAmount) / rowData.value.PAR_VALUE_RATE;
                const totalAmount =
                    Number(totalPVAmount) / rowData.value.PAR_VALUE_RATE;

                orderBookInfo = {
                    avgPrice: avgPrice * 100,
                    avgApr: avgApr * 100,
                    totalUsd,
                    totalAmount,
                    position: { top, left },
                };
            }
        }
        setOrderBookInfoData(orderBookInfo);
    };

    return (
        <>
            <table
                className={'w-full table-fixed overflow-hidden'}
                data-testid={coreTableOptions.name}
            >
                {coreTableOptions.showHeaders ? (
                    <thead className='font-tertiary text-xs leading-[14px] text-neutral-400 laptop:h-[22px] laptop:py-1'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                data-testid={`${coreTableOptions.name}-header`}
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        data-testid={`${coreTableOptions.name}-header-cell`}
                                        key={header.id}
                                        className='whitespace-nowrap pb-1 text-center font-normal laptop:px-4 laptop:pb-0'
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
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
                                    <div className='h-[22px] min-w-fit bg-[#808080]/20'></div>
                                </td>
                            </tr>
                        ) : (
                            <tr
                                key={row.id}
                                className={clsx(
                                    'h-4 w-full border-transparent laptop:h-[23px]',
                                    {
                                        'border-t':
                                            coreTableOptions.hoverDirection ===
                                            'up',
                                        'border-b':
                                            coreTableOptions.hoverDirection ===
                                            'down',
                                        'cursor-pointer bg-neutral-100/10':
                                            coreTableOptions.hoverRow?.(
                                                row.id
                                            ) &&
                                            activeRow &&
                                            coreTableOptions.hoverRow?.(
                                                activeRow
                                            ) &&
                                            onHoverBackground(row.id),
                                        'border-dashed border-z-neutral-100':
                                            coreTableOptions.hoverRow?.(
                                                row.id
                                            ) &&
                                            activeRow &&
                                            coreTableOptions.hoverRow?.(
                                                activeRow
                                            ) &&
                                            Number(row.id) ===
                                                Number(activeRow),
                                    }
                                )}
                                onClick={() =>
                                    coreTableOptions.hoverRow?.(row.id) &&
                                    coreTableOptions.onLineClick?.(row.id)
                                }
                                onMouseEnter={event => {
                                    handleMouseEnter(event, row);
                                }}
                                onMouseLeave={() => {
                                    setOrderBookInfoData(null);
                                    setActiveRow(undefined);
                                }}
                                data-testid={`${coreTableOptions.name}-row`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className='min-w-fit whitespace-nowrap font-normal'
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
            {orderBookInfoData && orderBookInfoData.avgPrice > 0 && (
                <OrderBookInfo OrderBookInfoData={orderBookInfoData} />
            )}
        </>
    );
};
