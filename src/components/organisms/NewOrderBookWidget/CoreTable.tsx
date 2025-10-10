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
    calculateFutureValue,
    FORMAT_DIGITS,
    formatter,
    PriceUtils,
} from 'src/utils';
import { AmountConverter } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';

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
        if (rowData.amount <= 0) return;
        const firstCell = event.currentTarget.querySelector('td');
        if (!firstCell) return;

        const rect = firstCell.getBoundingClientRect();
        const position = { top: rect.top + rect.height / 2, left: rect.left };
        const maturity = rowData.value._maturity;

        const allRows = table.getRowModel().rows;
        const hoveredRowIndex = allRows.findIndex(r => r.id === row.id);

        const relevantRows = (
            options.name === 'sellOrders'
                ? allRows.slice(0, hoveredRowIndex + 1)
                : allRows.slice(hoveredRowIndex)
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

        const avgPrice =
            Number(totalFVAmount) !== 0
                ? Number(totalPVAmount) / Number(totalFVAmount)
                : 0;

        const priceInBondFormat = PriceUtils.toBondPrice(avgPrice);
        const avgApr = LoanValue.fromPrice(
            priceInBondFormat,
            maturity
        ).apr.toNormalizedNumber();
        const limitedApr = PriceUtils.capApr(avgApr);

        const totalAmount = AmountConverter.fromBase(totalPVAmount, currency);
        const totalUsd = new Amount(totalPVAmount, currency)?.toUSD(price);

        setOrderBookInfoData({
            avgPrice: formatter.ordinary(
                FORMAT_DIGITS.PRICE,
                FORMAT_DIGITS.PRICE
            )(avgPrice * 100),
            avgApr: formatter.percentage(limitedApr, FORMAT_DIGITS.PRICE, 100),
            totalUsd: formatter.usd(totalUsd, FORMAT_DIGITS.PRICE, 'compact'),
            totalAmount: formatter.ordinary(
                FORMAT_DIGITS.ZERO,
                FORMAT_DIGITS.PRICE,
                'compact'
            )(totalAmount),
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
