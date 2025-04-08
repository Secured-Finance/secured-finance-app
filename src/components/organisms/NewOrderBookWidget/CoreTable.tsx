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
import { useSelector } from 'react-redux';
import { OrderBookInfoTooltip } from 'src/components/atoms';
import { useLastPrices } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    amountFormatterFromBase,
    calculateFutureValue,
    usdFormat,
} from 'src/utils';
import { Amount } from 'src/utils/entities';

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
        avgPrice: string;
        avgApr: string;
        totalAmount: string;
        totalUsd: string;
        position: { top: number; left: number };
    } | null>(null);

    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const { data: priceList } = useLastPrices();
    const price = priceList[currency];
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
        event: MouseEvent<HTMLTableRowElement>,
        row: Row<T>
    ) => {
        setActiveRow(row.id);
        const rowData = row.original as any;
        const firstCell = event.currentTarget.querySelector('td');
        if (!firstCell) return;

        const rect = firstCell.getBoundingClientRect();
        const position = { top: rect.top + rect.height / 2, left: rect.left };
        const currentUnix = Math.floor(Date.now() / 1000);
        const daysToMaturity = Math.max(
            (rowData.value._maturity - currentUnix) / (60 * 60 * 24),
            0
        );

        if (rowData.amount <= 0) return;

        const hoveredRowIndex = table
            .getRowModel()
            .rows.findIndex(r => r.id === row.id);
        const relevantRows = (
            options.name === 'sellOrders'
                ? table.getRowModel().rows.slice(0, hoveredRowIndex + 1)
                : table.getRowModel().rows.slice(hoveredRowIndex)
        )
            .map(r => r.original as any)
            .filter(r => r.amount > 0);

        if (relevantRows.length === 0) return;

        const totalFVAmount = relevantRows.reduce(
            (sum, order) =>
                sum +
                calculateFutureValue(
                    BigInt(order.amount),
                    BigInt(order.value._price)
                ),
            BigInt(0)
        );
        const totalPVAmount = relevantRows.reduce(
            (sum, order) => sum + BigInt(order.amount),
            BigInt(0)
        );

        const avgPrice = Number(totalPVAmount) / Number(totalFVAmount);
        const vwap = avgPrice * 100;
        const avgApr =
            daysToMaturity > 0 ? (100 / vwap - 1) * (365 / daysToMaturity) : 0;
        const totalAmount = new Intl.NumberFormat('en-US').format(
            amountFormatterFromBase[currency](totalPVAmount)
        );
        const totalUsd = new Amount(totalPVAmount, currency)?.toUSD(price);

        const formatToTwoDecimals = (num: number) => (num * 100).toFixed(2);

        setOrderBookInfoData({
            avgPrice: formatToTwoDecimals(avgPrice),
            avgApr: formatToTwoDecimals(Math.min(avgApr, 10)),
            totalUsd: usdFormat(Number(totalUsd), 2, 'compact'),
            totalAmount,
            position,
        });
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
            {orderBookInfoData && Number(orderBookInfoData.avgPrice) > 0 && (
                <OrderBookInfoTooltip
                    orderBookInfoData={orderBookInfoData}
                    currency={currency}
                />
            )}
        </>
    );
};
