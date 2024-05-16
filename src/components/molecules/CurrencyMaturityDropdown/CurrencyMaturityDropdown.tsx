import { Menu } from '@headlessui/react';
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    StarIcon,
} from '@heroicons/react/24/outline';
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { CloseButton, InputBase, Option } from 'src/components/atoms';
import { CurrencyOption } from 'src/components/molecules';
import { baseContracts, useBreakpoint, useLendingMarkets } from 'src/hooks';
import { CurrencySymbol, currencyMap } from 'src/utils';
import { columns, mobileColumns } from './constants';

// const selectedOption = useMemo(
//     () => optionList.find(o => o.value === selectedOptionValue),
//     [optionList, selectedOptionValue]
// );

// const handleSelect = useCallback(
//     (option: Option<T>) => {
//         if (option.value !== selectedOptionValue) {
//             setSelectedOptionValue(option.value);
//             // onChange(option.value);
//         }
//     },
//     [onChange, selectedOptionValue]
// );

export const CurrencyMaturityDropdown = <T extends string = string>({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: Option<T>[];
    maturity?: Option<T>;
    onChange: (
        currency: CurrencyOption['value'],
        maturity: Option<T>['value']
    ) => void;
}) => {
    const isTablet = useBreakpoint('laptop');
    const [searchValue, setSearchValue] = useState<string | undefined>('');
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();

    // TODO: redo this
    const [selectedOptionValue, setSelectedOptionValue] = useState<string>(
        `${asset.label}-${maturity.label}`
    );

    const tableHeaderColumns = isTablet ? mobileColumns : columns;

    const currencyOptions: {
        key: string;
        display: string;
        currency: CurrencySymbol;
        maturity: T;
    }[] = currencyList.flatMap(ccy =>
        maturityList.map(maturity => {
            const ccyMaturity = `${ccy.label}-${maturity.label}`;
            return {
                key: ccyMaturity,
                display: ccyMaturity,
                currency: ccy.value,
                maturity: maturity.value,
                iconSVG: currencyMap[ccy.value].icon,
            };
        })
    );

    const renderCell = useCallback(
        (
            option: {
                key: string;
                display: string;
                currency: CurrencySymbol;
                maturity: T;
                iconSVG: string;
            },
            columnKey: 'symbol' | 'last-prices' | '24h-change'
        ) => {
            switch (columnKey) {
                case 'symbol':
                    return (
                        <h3 className='flex items-center gap-1'>
                            <StarIcon className='h-3.5 w-3.5' />
                            {option.display}
                        </h3>
                    );
                case 'last-prices':
                    const ccy = option.currency;
                    const maturity = option.maturity;

                    // TODO: handle type error and how to get last price
                    return (
                        <span>
                            {/* {formatLoanValue(
                    lendingMarkets[ccy][maturity].marketUnitPrice,
                    'price'
                )} */}
                        </span>
                    );

                case '24h-change':
                    return <span>-2.10 (+2.24%)</span>;
                default:
                    return option[columnKey];
            }
            // TODO: pass in dependencies
        },

        []
    );

    return (
        <>
            <Menu>
                {({ open, close }) => (
                    <>
                        <Menu.Button className='flex items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold leading-6 text-white'>
                            <div className='flex gap-2'>
                                {selectedOptionValue}
                            </div>
                            <ChevronDownIcon
                                className={clsx('h-4 w-4 text-neutral-300', {
                                    'rotate-180': open,
                                })}
                            />
                        </Menu.Button>
                        <Menu.Items className='fixed left-0 top-[56px] flex w-full flex-col gap-3 border-t-4 border-primary-500 bg-neutral-800 px-4 pt-3 laptop:absolute laptop:max-w-[779px] laptop:border laptop:border-t-0 laptop:border-neutral-600 laptop:bg-neutral-900'>
                            <header className='flex items-center justify-between text-neutral-50 laptop:hidden'>
                                <div className='flex items-center gap-1'>
                                    <MagnifyingGlassIcon className='h-5 w-5' />
                                    <h2 className='text-smd font-semibold leading-7'>
                                        Search
                                    </h2>
                                </div>
                                <CloseButton onClick={close} />
                            </header>
                            {/* TODO: change to design system input field */}
                            <InputBase
                                className='rounded-lg border border-neutral-500 !bg-neutral-900 px-3 py-2 focus:border-primary-500 active:border-[1.5px]'
                                onValueChange={searchTerm =>
                                    setSearchValue(searchTerm)
                                }
                                value={searchValue}
                            />

                            <Table
                                aria-label='Currency Maturity Dropdown'
                                selectionMode='single'
                                removeWrapper
                            >
                                <TableHeader columns={tableHeaderColumns}>
                                    {column => (
                                        <TableColumn
                                            className='h-5 border-b border-neutral-700 px-0 text-xs font-normal leading-5 text-neutral-400'
                                            key={column.key}
                                        >
                                            {column.label}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={currencyOptions}>
                                    {item => (
                                        <TableRow
                                            key={item.key}
                                            className='cursor-pointer overflow-hidden rounded border-b border-neutral-600 laptop:border-b-0 laptop:hover:bg-neutral-700'
                                            onClick={() => {
                                                onChange(
                                                    item.currency,
                                                    item.maturity
                                                );
                                                setSelectedOptionValue(
                                                    item.display
                                                );
                                                close();
                                            }}
                                        >
                                            {columnKey => (
                                                <TableCell className='px-0 py-2 text-xs leading-5 text-neutral-50'>
                                                    {renderCell(
                                                        item,
                                                        columnKey
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Menu.Items>
                    </>
                )}
            </Menu>
        </>
    );
};
