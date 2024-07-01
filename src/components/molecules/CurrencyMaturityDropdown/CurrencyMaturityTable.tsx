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
import { useCallback, useState } from 'react';
import { useBreakpoint } from 'src/hooks';
import { SavedMarket } from 'src/types';
import { calculateTimeDifference, formatDuration } from 'src/utils';
import {
    isMarketInStore,
    readMarketsFromStore,
    removeMarketFromStore,
    writeMarketInStore,
} from 'src/utils/markets';
import { useAccount } from 'wagmi';
import { desktopColumns, mobileColumns } from './constants';
import { ColumnKey, FilteredOption } from './types';

export const CurrencyMaturityTable = ({
    options,
    onOptionClick,
    close,
    onSortChange,
    sortState,
}: {
    options: FilteredOption[];
    onOptionClick: (item: FilteredOption) => void;
    close: () => void;
    onSortChange: (descriptor: SortDescriptor) => void;
    sortState: SortDescriptor;
}) => {
    const isTablet = useBreakpoint('laptop');
    const columns = isTablet ? mobileColumns : desktopColumns;
    const [savedMarkets, setSavedMarkets] = useState(() => {
        return readMarketsFromStore();
    });
    const { address, isConnected } = useAccount();

    const renderCell = useCallback(
        (option: (typeof options)[0], columnKey: ColumnKey) => {
            const { maturity } = option;

            const toggleSave = (market: string) => {
                const marketEntry = { market, address };

                if (isMarketInStore(marketEntry)) {
                    removeMarketFromStore(marketEntry);
                } else {
                    writeMarketInStore(marketEntry);
                }
                setSavedMarkets(readMarketsFromStore());
            };

            switch (columnKey) {
                case 'symbol':
                    return (
                        <h3 className='flex items-center gap-1 font-secondary'>
                            {isConnected && (
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        toggleSave(option.display);
                                    }}
                                >
                                    {savedMarkets.some(
                                        (savedMarket: SavedMarket) =>
                                            savedMarket.market ===
                                                option.display &&
                                            savedMarket.address === address
                                    ) ? (
                                        <FilledStarIcon className='h-3.5 w-3.5 text-warning-300' />
                                    ) : (
                                        <StarIcon className='h-3.5 w-3.5' />
                                    )}
                                </button>
                            )}

                            {option.display}
                        </h3>
                    );
                case 'last-prices':
                    return option.lastPrice;
                case 'last-prices-mobile':
                    return `${option.lastPrice} (${option.apr})`;
                case 'apr':
                    return option.apr;
                case 'maturity':
                    const timestampDifference = calculateTimeDifference(
                        +maturity
                    );
                    return formatDuration(Math.abs(timestampDifference));
                default:
                    return null;
            }
        },
        [savedMarkets, address, isConnected]
    );

    return (
        <Table
            aria-label='Currency Maturity Dropdown'
            selectionMode='single'
            classNames={{
                base: 'laptop:h-[232px] h-[calc(100%-185px)] overflow-auto laptop:pl-4 laptop:pr-3',
                table: 'laptop:border-separate laptop:border-spacing-y-1',
                sortIcon: 'hidden',
            }}
            onSortChange={(descriptor: SortDescriptor) =>
                onSortChange(descriptor)
            }
            sortDescriptor={sortState}
            removeWrapper
            isHeaderSticky
        >
            <TableHeader>
                {columns.map(column => {
                    const sortIconStyle = 'relative';
                    const isColumnSortedAscending =
                        sortState.column === column.key &&
                        sortState.direction === 'ascending';
                    const isColumnSortedDescending =
                        sortState.column === column.key &&
                        sortState.direction === 'descending';
                    return (
                        <TableColumn
                            className='typography-mobile-body-5 laptop:typography-desktop-body-5 relative h-5 !rounded-none bg-neutral-800 px-0 font-normal text-neutral-400 laptop:bg-neutral-900'
                            key={column.key}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            width={column.width as any}
                            allowsSorting={column.allowsSorting}
                        >
                            <div className='flex gap-1'>
                                {column.label}
                                {column.allowsSorting && (
                                    <div className='flex w-2 flex-col justify-center'>
                                        <ChevronUpIcon
                                            className={clsx(
                                                sortIconStyle,
                                                'top-[1px]',
                                                {
                                                    'text-neutral-50':
                                                        isColumnSortedAscending,
                                                    'text-neutral-400':
                                                        !isColumnSortedAscending &&
                                                        !isColumnSortedDescending,
                                                }
                                            )}
                                        />
                                        <AngleDownIcon
                                            className={clsx(
                                                sortIconStyle,
                                                'bottom-[1px]',
                                                {
                                                    'text-neutral-50':
                                                        isColumnSortedDescending,
                                                    'text-neutral-400':
                                                        !isColumnSortedAscending &&
                                                        !isColumnSortedDescending,
                                                }
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                            <span className='absolute bottom-0 left-0 h-[1px] w-full bg-neutral-700'></span>
                        </TableColumn>
                    );
                })}
            </TableHeader>
            <TableBody items={options} emptyContent='No products found'>
                {item => (
                    <TableRow
                        key={item.key}
                        className='cursor-pointer overflow-hidden rounded border-b border-neutral-600 laptop:border-b-0 laptop:hover:bg-neutral-700'
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
