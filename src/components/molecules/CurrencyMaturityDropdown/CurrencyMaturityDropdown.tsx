import useLockBodyScroll from '@custom-react-hooks/use-lock-body-scroll';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SortDescriptor } from '@nextui-org/table';
import { Key } from '@react-types/shared';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CurrencyMaturityTable, FilterButtons } from 'src/components/molecules';
import {
    baseContracts,
    useBreakpoint,
    useCurrencies,
    useLendingMarkets,
} from 'src/hooks';
import { CurrencySymbol, currencyMap, formatLoanValue } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { CurrencyMaturityDropdownProps, FilteredOption } from './types';

export const CurrencyMaturityDropdown = ({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
    isItayosePage = false,
}: CurrencyMaturityDropdownProps) => {
    const isTablet = useBreakpoint('laptop');
    const [searchValue, setSearchValue] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    useLockBodyScroll(isTablet && isDropdownOpen);

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

    const prevSelectedValue = useRef('');
    useEffect(() => {
        if (
            !prevSelectedValue ||
            prevSelectedValue.current !== maturity.value.toString()
        ) {
            onChange(asset.value, maturity.value);
        }
        prevSelectedValue.current = maturity.value.toString();
    }, [onChange, maturity, asset]);

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
            return;
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
                    <Menu.Button
                        className='flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold normal-case leading-6 text-white laptop:w-[226px] laptop:py-2.5 laptop:pl-3 laptop:pr-2 laptop:text-base laptop:leading-6 desktop:w-[302px] desktop:text-[22px]'
                        onClick={() => setIsDropdownOpen(!open)}
                    >
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
                    {isDropdownOpen && (
                        <Menu.Items className='fixed left-0 top-[56px] z-[31] flex h-full w-full flex-col gap-3 overflow-hidden border-t-4 border-primary-500 bg-neutral-800 px-4 pt-3 tablet:top-[72px] laptop:absolute laptop:left-auto laptop:top-auto laptop:mt-1.5 laptop:h-auto laptop:w-[779px] laptop:rounded-xl laptop:border laptop:border-neutral-600 laptop:bg-neutral-900 laptop:px-0'>
                            <header className='flex items-center justify-between text-neutral-50 laptop:hidden'>
                                <div className='flex items-center gap-1'>
                                    <MagnifyingGlassIcon className='h-5 w-5' />
                                    <h2 className='typography-mobile-h-6 tracking-normal'>
                                        Search
                                    </h2>
                                </div>
                                <button
                                    className='flex h-8 w-8 items-center justify-center rounded-full border border-neutral-600 tablet:border-[1.75px]'
                                    onClick={() => {
                                        close();
                                        setIsDropdownOpen(false);
                                    }}
                                    data-testid='close-button'
                                    aria-label='Close'
                                >
                                    <XMarkIcon className='h-4 w-4 text-neutral-50' />
                                </button>
                            </header>

                            <div className='flex flex-col gap-3 laptop:px-4'>
                                <input
                                    className='typography-mobile-body-4 laptop:typography-desktop-body-4 rounded-lg border border-neutral-500 bg-neutral-900 px-3 py-2 text-neutral-300 focus:border-[1.5px] focus:border-primary-500 focus:outline-none focus:ring-primary-500'
                                    onChange={e =>
                                        setSearchValue(e.target.value)
                                    }
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
                                close={() => setIsDropdownOpen(false)}
                                onSortChange={handleSortChange}
                                sortState={sortState}
                            />
                        </Menu.Items>
                    )}
                </div>
            )}
        </Menu>
    );
};
