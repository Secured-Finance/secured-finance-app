import { Menu } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import { Key } from '@react-types/shared';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    baseContracts,
    useBreakpoint,
    useCurrencies,
    useLendingMarkets,
} from 'src/hooks';
import {
    CurrencySymbol,
    calculateTimeDifference,
    currencyMap,
    formatDuration,
    formatLoanValue,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { desktopColumns, mobileColumns } from './constants';
import {
    ColumnKey,
    CurrencyMaturityDropdownProps,
    FilteredOption,
} from './types';

export const CurrencyMaturityDropdown = ({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
    isItayosePage = false,
}: CurrencyMaturityDropdownProps) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [currentCurrency, setCurrentCurrency] = useState<
        CurrencySymbol | undefined
    >(undefined);
    const [isItayose, setIsItayose] = useState<boolean>(false);
    const [sortState, setSortState] = useState<{
        column?: Key;
        direction?: 'ascending' | 'descending';
    }>({
        column: undefined,
        direction: 'ascending',
    });

    const sortOptions = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options: any[]) => {
            const { column, direction } = sortState;

            if (!column) {
                return options;
            }

            return options.sort((a, b) => {
                let aValue, bValue;

                if (column === 'apr') {
                    aValue = parseFloat(a.apr.replace('%', ''));
                    bValue = parseFloat(b.apr.replace('%', ''));
                } else if (column === 'maturity') {
                    aValue = a.maturity;
                    bValue = b.maturity;
                } else {
                    aValue = a[column];
                    bValue = b[column];
                }

                if (aValue < bValue) {
                    return direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        },
        [sortState]
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const { data: currencies } = useCurrencies();
    const router = useRouter();

    const CcyIcon = currencyMap[asset.value]?.icon;

    const filteredOptions = useMemo(() => {
        let options = currencyList.flatMap(currency => {
            return maturityList
                .map(maturity => {
                    const ccyMaturity = `${currency.label}-${maturity.label}`;
                    const data =
                        lendingMarkets[currency.value]?.[+maturity.value];
                    const isItayoseOption =
                        data?.isItayosePeriod || data?.isPreOrderPeriod;

                    const marketUnitPrice = data?.marketUnitPrice;
                    const openingUnitPrice = data?.openingUnitPrice;

                    let lastPrice: LoanValue | undefined;

                    if (openingUnitPrice) {
                        lastPrice = LoanValue.fromPrice(
                            openingUnitPrice,
                            +maturity.value
                        );
                    } else if (marketUnitPrice) {
                        lastPrice = LoanValue.fromPrice(
                            marketUnitPrice,
                            +maturity.value
                        );
                    }

                    if (
                        (currentCurrency &&
                            !currentCurrency.includes(currency.value)) ||
                        (isItayose && !isItayoseOption) ||
                        (searchValue &&
                            !ccyMaturity
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()))
                    ) {
                        return null;
                    }

                    return {
                        key: ccyMaturity,
                        display: ccyMaturity,
                        currency: currency.value,
                        maturity: maturity.value,
                        lastPrice: formatLoanValue(lastPrice, 'price'),
                        apr: formatLoanValue(lastPrice, 'rate'),
                        isItayoseOption,
                    };
                })
                .filter(Boolean);
        });

        options = sortOptions(options);

        return options;
    }, [
        currencyList,
        sortOptions,
        maturityList,
        lendingMarkets,
        currentCurrency,
        isItayose,
        searchValue,
    ]);

    const handleOptionClick = (item: FilteredOption) => {
        if (item.isItayoseOption) {
            router.push('/itayose');
        }

        if (item.currency !== asset.value || item.maturity !== maturity.value) {
            onChange(item.currency, item.maturity);
        }
    };

    const handleSortChange = (descriptor: SortDescriptor) => {
        const { column, direction } = descriptor;

        setSortState({
            column: column as string,
            direction: direction,
        });
    };

    return (
        <Menu>
            {({ open, close }) => (
                <div className='relative'>
                    <Menu.Button className='flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold normal-case leading-6 text-white laptop:w-[226px] laptop:py-2.5 laptop:pl-3 laptop:pr-2 laptop:text-base laptop:leading-6 desktop:w-[302px] desktop:text-[22px]'>
                        <div className='flex items-center gap-2 laptop:gap-1'>
                            {!!CcyIcon && (
                                <CcyIcon className='h-5 w-5 laptop:h-6 laptop:w-6' />
                            )}
                            {asset.label}-{maturity.label}
                        </div>
                        <ChevronDownIcon
                            className={`h-4 w-4 text-neutral-300 laptop:h-6 laptop:w-6 ${
                                open ? 'rotate-180' : ''
                            }`}
                        />
                    </Menu.Button>
                    <Menu.Items className='fixed left-0 top-[56px] z-[31] flex h-full w-full flex-col gap-3 overflow-hidden border-t-4 border-primary-500 bg-neutral-800 px-4 pt-3 tablet:top-[72px] laptop:absolute laptop:left-auto laptop:top-auto laptop:mt-1.5 laptop:h-auto laptop:w-[779px] laptop:rounded-xl laptop:border laptop:border-neutral-600 laptop:bg-neutral-900 laptop:px-0'>
                        <header className='flex items-center justify-between text-neutral-50 laptop:hidden'>
                            <div className='flex items-center gap-1'>
                                <MagnifyingGlassIcon className='h-5 w-5' />
                                <h2 className='typography-mobile-h-6 tracking-normal'>
                                    Search
                                </h2>
                            </div>
                            <button
                                className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-600 tablet:h-7 tablet:w-7 tablet:border-[1.75px]'
                                onClick={close}
                                data-testid='close-button'
                                aria-label='Close'
                            >
                                <XMarkIcon className='h-4 w-4 text-neutral-50 tablet:h-[21px] tablet:w-[21px]' />
                            </button>
                        </header>

                        <div className='flex flex-col gap-3 laptop:px-4'>
                            <input
                                className='typography-mobile-body-4 laptop:typography-desktop-body-4 rounded-lg border border-neutral-500 bg-neutral-900 px-3 py-2 text-neutral-300 focus:border-[1.5px] focus:border-primary-500 focus:outline-none focus:ring-primary-500'
                                onChange={e => setSearchValue(e.target.value)}
                                value={searchValue}
                                placeholder='Search products...'
                            />

                            <FilterButtons
                                currencies={currencies}
                                currentCurrency={currentCurrency}
                                isItayose={isItayose}
                                setCurrentCurrency={setCurrentCurrency}
                                setIsItayose={setIsItayose}
                                isItayosePage={isItayosePage}
                            />
                        </div>

                        <CurrencyMaturityTable
                            options={filteredOptions as FilteredOption[]}
                            onOptionClick={handleOptionClick}
                            close={close}
                            onSortChange={handleSortChange}
                            sortState={sortState}
                        />
                    </Menu.Items>
                </div>
            )}
        </Menu>
    );
};

const FilterButtons = ({
    currencies,
    currentCurrency,
    isItayose,
    setCurrentCurrency,
    setIsItayose,
    isItayosePage,
}: {
    currencies?: CurrencySymbol[];
    currentCurrency: CurrencySymbol | undefined;
    isItayose: boolean;
    setCurrentCurrency: (currency: CurrencySymbol | undefined) => void;
    setIsItayose: (value: boolean) => void;
    isItayosePage: boolean;
}) => {
    const FilterBtn = ({
        onClick,
        children,
        activeCondition,
        label,
    }: {
        onClick: () => void;
        children: React.ReactNode;
        activeCondition: boolean;
        label?: string;
    }) => (
        <button
            className={clsx('typography-mobile-body-5', {
                'text-primary-300': activeCondition,
                'text-neutral-400': !activeCondition,
            })}
            onClick={onClick}
            aria-label={label}
        >
            {children}
        </button>
    );

    return (
        <div className='flex items-center gap-[13.5px]'>
            <FilterBtn
                activeCondition={!currentCurrency && !isItayose}
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(false);
                }}
            >
                All
            </FilterBtn>
            {!isItayosePage && (
                <FilterBtn
                    activeCondition={isItayose && !currentCurrency}
                    onClick={() => {
                        setCurrentCurrency(undefined);
                        setIsItayose(true);
                    }}
                    label='itayose-filter-btn'
                >
                    Itayose
                </FilterBtn>
            )}
            {currencies?.map(currency => (
                <FilterBtn
                    key={`currency-${currency}`}
                    activeCondition={currentCurrency === currency}
                    onClick={() => {
                        setCurrentCurrency(currency);
                        setIsItayose(false);
                    }}
                    label={`${currency}-filter-btn`}
                >
                    {currency}
                </FilterBtn>
            ))}
        </div>
    );
};

const CurrencyMaturityTable = ({
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

    const renderCell = (option: (typeof options)[0], columnKey: ColumnKey) => {
        const { maturity } = option;

        switch (columnKey) {
            case 'symbol':
                return (
                    <h3 className='flex items-center gap-1 font-secondary'>
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
                const timestampDifference = calculateTimeDifference(+maturity);
                return formatDuration(Math.abs(timestampDifference));
            default:
                return null;
        }
    };

    return (
        <Table
            aria-label='Currency Maturity Dropdown'
            selectionMode='single'
            classNames={{
                base: 'laptop:h-[232px] overflow-auto laptop:pl-4 laptop:pr-3',
                table: 'max-h-[400px] border-separate border-spacing-y-1',
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
                    const sortIconStyle = 'w-[15px]';
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
                                    <div className='flex w-2.5 flex-col gap-[3px]'>
                                        <ChevronUpIcon
                                            className={clsx(sortIconStyle, {
                                                'text-white':
                                                    isColumnSortedAscending,
                                                'text-neutral-400':
                                                    !isColumnSortedAscending &&
                                                    !isColumnSortedDescending,
                                            })}
                                        />
                                        <ChevronDownIcon
                                            className={clsx(sortIconStyle, {
                                                'text-white':
                                                    isColumnSortedDescending,
                                                'text-neutral-400':
                                                    !isColumnSortedAscending &&
                                                    !isColumnSortedDescending,
                                            })}
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
                            <TableCell className='typography-mobile-body-5 laptop:typography-desktop-body-5 px-0 py-0 font-numerical text-neutral-50'>
                                {renderCell(item, `${columnKey}`)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
