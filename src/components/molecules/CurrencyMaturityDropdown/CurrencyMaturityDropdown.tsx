import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import React, { useMemo, useState } from 'react';
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
import { LoanValue, Maturity } from 'src/utils/entities';
import { desktopColumns, mobileColumns } from './constants';
import {
    ColumnKey,
    CurrencyMaturityDropdownProps,
    FilteredOptionsType,
} from './types';

export const CurrencyMaturityDropdown = ({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: CurrencyMaturityDropdownProps) => {
    const isTablet = useBreakpoint('laptop');
    const [searchValue, setSearchValue] = useState<string>('');
    const [currentCurrency, setCurrentCurrency] = useState<
        CurrencySymbol | undefined
    >(undefined);
    const [isItayose, setIsItayose] = useState<boolean>(false);
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const { data: currencies } = useCurrencies();

    const CcyIcon = currencyMap[asset.value]?.icon;

    const filteredOptions = useMemo(() => {
        return currencyList.flatMap(currency => {
            return maturityList
                .map(maturity => {
                    const ccyMaturity = `${currency.label}-${maturity.label}`;
                    const data =
                        lendingMarkets[currency.value]?.[+maturity.value];

                    if (
                        (currentCurrency &&
                            !currentCurrency.includes(currency.value)) ||
                        (isItayose && !data?.isItayosePeriod) ||
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
                    };
                })
                .filter(Boolean);
        });
    }, [
        currencyList,
        maturityList,
        lendingMarkets,
        currentCurrency,
        isItayose,
        searchValue,
    ]);

    const handleOptionClick = (
        currency: CurrencySymbol,
        selectedMaturity: Maturity
    ) => {
        if (currency !== asset.value || selectedMaturity !== maturity.value) {
            onChange(currency, selectedMaturity);
        }
    };

    return (
        <Menu>
            {({ open, close }) => (
                <div className='relative'>
                    <Menu.Button className='laptop:typography-desktop-sh-9 flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold leading-6 text-white laptop:min-w-[190px] laptop:py-2.5 laptop:pl-3 laptop:pr-2'>
                        <div className='flex items-center gap-2 laptop:gap-1'>
                            {CcyIcon && (
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
                            />
                        </div>

                        <CurrencyMaturityTable
                            isTablet={isTablet}
                            options={filteredOptions as FilteredOptionsType}
                            onOptionClick={handleOptionClick}
                            close={close}
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
}: {
    currencies?: CurrencySymbol[];
    currentCurrency: CurrencySymbol | undefined;
    isItayose: boolean;
    setCurrentCurrency: (currency: CurrencySymbol | undefined) => void;
    setIsItayose: (value: boolean) => void;
}) => {
    const FilterBtn = ({
        onClick,
        children,
        activeCondition,
    }: {
        onClick: () => void;
        children: React.ReactNode;
        activeCondition: boolean;
    }) => (
        <button
            className={`typography-mobile-body-5 text-neutral-400 ${
                activeCondition ? 'text-primary-300' : ''
            }`}
            onClick={onClick}
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
            <FilterBtn
                activeCondition={isItayose && !currentCurrency}
                onClick={() => {
                    setCurrentCurrency(undefined);
                    setIsItayose(true);
                }}
            >
                Itayose
            </FilterBtn>
            {currencies?.map(currency => (
                <FilterBtn
                    key={`currency-${currency}`}
                    activeCondition={currentCurrency === currency}
                    onClick={() => {
                        setCurrentCurrency(currency);
                        setIsItayose(false);
                    }}
                >
                    {currency}
                </FilterBtn>
            ))}
        </div>
    );
};

const CurrencyMaturityTable = ({
    isTablet,
    options,
    onOptionClick,
    close,
}: {
    isTablet: boolean;
    options: {
        key: string;
        display: string;
        currency: CurrencySymbol;
        maturity: Maturity;
    }[];
    onOptionClick: (currency: CurrencySymbol, maturity: Maturity) => void;
    close: () => void;
}) => {
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const columns = isTablet ? mobileColumns : desktopColumns;

    const renderCell = (option: (typeof options)[0], columnKey: ColumnKey) => {
        const { currency, maturity } = option;
        const data = lendingMarkets[currency]?.[+maturity];

        const marketUnitPrice = data?.marketUnitPrice;
        const openingUnitPrice = data?.openingUnitPrice;

        let lastPrice: LoanValue | undefined;

        if (openingUnitPrice) {
            lastPrice = LoanValue.fromPrice(openingUnitPrice, +maturity);
        } else if (marketUnitPrice) {
            lastPrice = LoanValue.fromPrice(marketUnitPrice, +maturity);
        }

        switch (columnKey) {
            case 'symbol':
                return (
                    <h3 className='flex items-center gap-1 font-secondary'>
                        {option.display}
                    </h3>
                );
            case 'last-prices':
                return formatLoanValue(lastPrice, 'price');
            case 'last-prices-mobile':
                return (
                    <span>
                        {formatLoanValue(lastPrice, 'price')} (
                        {formatLoanValue(lastPrice, 'rate')})
                    </span>
                );
            case 'apr':
                return formatLoanValue(lastPrice, 'rate');
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
            removeWrapper
            isHeaderSticky
            classNames={{
                base: 'laptop:h-[232px] overflow-auto laptop:pl-4 laptop:pr-3',
                table: 'max-h-[400px]',
            }}
        >
            <TableHeader columns={columns}>
                {column => (
                    <TableColumn
                        className='typography-mobile-body-5 laptop:typography-desktop-body-5 relative h-5 !rounded-none bg-neutral-800 px-0 font-normal text-neutral-400 laptop:bg-neutral-900'
                        key={column.key}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        width={column.width as any}
                    >
                        {column.label}
                        <span className='absolute bottom-0 left-0 h-[1px] w-full bg-neutral-700'></span>
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={options} emptyContent='No products found'>
                {item => (
                    <TableRow
                        key={item.key}
                        className='cursor-pointer overflow-hidden rounded border-b border-neutral-600 laptop:border-b-0 laptop:hover:bg-neutral-700'
                        onClick={() => {
                            onOptionClick(item.currency, item.maturity);
                            close();
                        }}
                    >
                        {columnKey => (
                            <TableCell className='typography-mobile-body-5 laptop:typography-desktop-body-5 px-0 py-2 font-numerical text-neutral-50'>
                                {renderCell(item, `${columnKey}`)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
