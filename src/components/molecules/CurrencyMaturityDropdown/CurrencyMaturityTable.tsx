import {
    ChevronDownIcon as AngleDownIcon,
    ChevronUpIcon,
    StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as FilledStarIcon } from '@heroicons/react/24/solid';
import {
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useBreakpoint, useIsSubgraphSupported } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import {
    calculateTimeDifference,
    currencyMap,
    formatDuration,
    usdFormat,
} from 'src/utils';
import { useAccount } from 'wagmi';
import { desktopColumns, mobileColumns } from './constants';
import { ColumnKey, ColumnType, FilteredOption } from './types';

export const CurrencyMaturityTable = ({
    options,
    onOptionClick,
    close,
    onSortChange,
    sortState,
    onFavouriteToggle,
}: {
    options: FilteredOption[];
    onOptionClick: (item: FilteredOption) => void;
    close: () => void;
    onSortChange: (descriptor: SortDescriptor) => void;
    sortState: SortDescriptor;
    onFavouriteToggle: (market: string) => void;
}) => {
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const isTablet = useBreakpoint('laptop');
    const { isConnected } = useAccount();
    const columns: ColumnType[] = isTablet ? mobileColumns : desktopColumns;

    const renderCell = useCallback(
        (option: (typeof options)[0], columnKey: ColumnKey) => {
            const { display, isFavourite, currency } = option;

            const CcyIcon = currencyMap[currency]?.icon;

            switch (columnKey) {
                case 'symbol':
                    return (
                        <h3 className='flex items-center gap-1 font-secondary laptop:gap-1.5'>
                            {isConnected && (
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        onFavouriteToggle(display);
                                    }}
                                    aria-label={`${
                                        isFavourite ? 'Remove' : 'Add'
                                    } ${display} ${
                                        isFavourite ? 'from' : 'to'
                                    } favorites`}
                                >
                                    {isFavourite ? (
                                        <FilledStarIcon className='h-3.5 w-3.5 text-warning-300' />
                                    ) : (
                                        <StarIcon className='h-3.5 w-3.5' />
                                    )}
                                </button>
                            )}
                            <div className='flex items-center gap-1'>
                                <CcyIcon className='h-4 w-4' />
                                {display}
                            </div>
                        </h3>
                    );
                case 'mark-prices':
                    return option.lastPrice;
                case 'mark-prices-mobile':
                    return `${option.lastPrice} (${option.apr})`;
                case 'apr':
                    return option.apr;
                case 'maturity':
                    const timestampDifference = calculateTimeDifference(
                        +option.maturity
                    );
                    return (
                        <div className='flex justify-end whitespace-nowrap pr-3'>
                            {formatDuration(Math.abs(timestampDifference))}
                        </div>
                    );
                case 'volume':
                    return option.volume
                        ? usdFormat(option.volume, 2, 'compact')
                        : '-';
                default:
                    return null;
            }
        },
        [isConnected, onFavouriteToggle]
    );

    return (
        <Table
            aria-label='Currency Maturity Dropdown'
            selectionMode='single'
            classNames={{
                base: clsx(
                    'laptop:h-[232px] overflow-auto laptop:pl-4 laptop:pr-3',
                    {
                        'h-[calc(100vh-355px)]': chainError,
                        'h-[calc(100vh-332px)]': !chainError,
                    }
                ),
                table: 'laptop:border-separate laptop:border-spacing-y-1',
                sortIcon: 'hidden',
                tbody: 'pb-10',
            }}
            onSortChange={(descriptor: SortDescriptor) =>
                onSortChange(descriptor)
            }
            sortDescriptor={sortState}
            removeWrapper
            isHeaderSticky
        >
            <TableHeader>
                {columns
                    .filter(
                        col =>
                            !(!isSubgraphSupported && col?.isSubgraphSupported)
                    )
                    .map((column: ColumnType) => {
                        return (
                            <TableColumn
                                className='typography-mobile-body-5 laptop:typography-desktop-body-5 relative h-5 !rounded-none bg-neutral-800 px-0 font-normal text-neutral-400 laptop:bg-neutral-900'
                                key={column.key}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                width={column.width as any}
                                allowsSorting={column.allowsSorting}
                            >
                                <div
                                    className={clsx(
                                        'flex gap-1',
                                        column?.className
                                    )}
                                >
                                    {column.label}
                                    {column.allowsSorting && (
                                        <SortArrows
                                            sortState={sortState}
                                            column={column}
                                        />
                                    )}
                                </div>
                                <span className='absolute bottom-0 left-0 h-[1px] w-full bg-neutral-700'></span>
                            </TableColumn>
                        );
                    })}
            </TableHeader>
            <TableBody
                items={options}
                emptyContent={
                    <span className='text-neutral-4'>No products found</span>
                }
            >
                {item => (
                    <TableRow
                        key={item.key}
                        className='cursor-pointer overflow-hidden rounded laptop:hover:bg-neutral-700'
                        onClick={() => {
                            onOptionClick(item);
                            close();
                        }}
                    >
                        {columnKey => (
                            <TableCell className='typography-mobile-body-5 laptop:typography-desktop-body-5 border-b border-neutral-600 px-0 py-2 font-numerical text-neutral-50 laptop:border-b-0 laptop:py-0'>
                                {renderCell(item, `${columnKey}`)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

const SortArrows = ({
    sortState,
    column,
}: {
    sortState: SortDescriptor;
    column: ColumnType;
}) => {
    const sortIconStyle = 'relative';
    const isColumnSortedAscending =
        sortState.column === column.key && sortState.direction === 'ascending';
    const isColumnSortedDescending =
        sortState.column === column.key && sortState.direction === 'descending';
    return (
        <div className='flex w-2 flex-col justify-center'>
            <ChevronUpIcon
                className={clsx(sortIconStyle, 'top-[1px]', {
                    'text-neutral-50': isColumnSortedAscending,
                    'text-neutral-400':
                        !isColumnSortedAscending && !isColumnSortedDescending,
                })}
            />
            <AngleDownIcon
                className={clsx(sortIconStyle, 'bottom-[1px]', {
                    'text-neutral-50': isColumnSortedDescending,
                    'text-neutral-400':
                        !isColumnSortedAscending && !isColumnSortedDescending,
                })}
            />
        </div>
    );
};
