import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
import { CloseButton, Option } from 'src/components/atoms';
import {
    baseContracts,
    useBreakpoint,
    useCurrencies,
    useLendingMarkets,
} from 'src/hooks';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    calculateTimeDifference,
    currencyMap,
    formatDuration,
    formatLoanValue,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { columns, mobileColumns } from './constants';
import { ColumnKey } from './types';

type CurrencyMaturityDropdownProps = {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: MaturityOptionList;
    maturity?: Option<Maturity>;
    onChange: (
        currency: CurrencySymbol,
        maturity: Option<Maturity>['value']
    ) => void;
};

export const CurrencyMaturityDropdown = ({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: CurrencyMaturityDropdownProps) => {
    const isTablet = useBreakpoint('laptop');
    const [searchValue, setSearchValue] = useState<string | undefined>('');
    const [currentCcy, setCurrentCcy] = useState<CurrencySymbol>();
    const [isItayose, setIsItayose] = useState<boolean>(false);
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const { data: currencies } = useCurrencies();

    // const dailyVolumesCollection = useDailyVolumesByMarket();
    // const { data: priceList } = useLastPrices();

    const CcyIcon = currencyMap[asset.value].icon;

    const tableHeaderColumns = isTablet ? mobileColumns : columns;
    // TODO: include this for when checking subgraph-relevant fields
    // tableHeaderColumns = tableHeaderColumns.filter(column => {
    //     if (isSubgraphSupported || !column.isSubgraphField) {
    //         return true;
    //     }
    //     return false;
    // });

    const currencyOptions = currencyList.flatMap(ccy => {
        return maturityList.map(maturity => {
            const ccyMaturity = `${ccy.label}-${maturity.label}`;

            const data = lendingMarkets[ccy.value][+maturity];

            if (currentCcy && !currentCcy?.includes(ccy.value)) return null;

            if (
                searchValue &&
                !ccyMaturity
                    .toLocaleLowerCase()
                    .includes(searchValue.toLowerCase())
            )
                return null;

            if (isItayose && !data?.isItayosePeriod) {
                return null;
            }

            return {
                key: ccyMaturity,
                display: ccyMaturity,
                currency: ccy.value,
                maturity: maturity.value,
            };
        });
    });

    const renderCell = useCallback(
        (
            option: {
                key: ColumnKey;
                display: string;
                currency: CurrencySymbol;
                maturity: Maturity;
            },
            columnKey: ColumnKey
        ) => {
            const ccy = option.currency;
            const maturity = option.maturity;

            const data = lendingMarkets[ccy][+maturity];

            const marketUnitPrice = data?.marketUnitPrice;
            const openingUnitPrice = data?.openingUnitPrice;

            let lastPrice;

            if (openingUnitPrice) {
                lastPrice = LoanValue.fromPrice(openingUnitPrice, +maturity);
            }

            if (marketUnitPrice) {
                lastPrice = LoanValue.fromPrice(marketUnitPrice, +maturity);
            }

            switch (columnKey) {
                case 'symbol':
                    return (
                        <h3 className='flex items-center gap-1'>
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
                    const timestampDifference = calculateTimeDifference(
                        +maturity
                    );
                    return formatDuration(Math.abs(timestampDifference));
            }
        },
        [lendingMarkets]
    );

    return (
        <Menu>
            {({ open, close }) => (
                <div className='relative'>
                    <Menu.Button className='laptop:typography-desktop-sh-9 flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold leading-6 text-white laptop:min-w-[190px] laptop:py-2.5 laptop:pl-3 laptop:pr-2'>
                        <div className='flex items-center gap-2 laptop:gap-1'>
                            <CcyIcon className='h-5 w-5 laptop:h-6 laptop:w-6' />
                            {asset.label}-{maturity.label}
                        </div>
                        <ChevronDownIcon
                            className={clsx(
                                'h-4 w-4 text-neutral-300 laptop:h-6 laptop:w-6',
                                {
                                    'rotate-180': open,
                                }
                            )}
                        />
                    </Menu.Button>
                    <Menu.Items className='fixed left-0 top-[56px] z-[28] flex h-full w-full flex-col gap-3 overflow-hidden border-t-4 border-primary-500 bg-neutral-800 px-4 pt-3 laptop:absolute laptop:left-auto laptop:top-auto laptop:mt-1.5 laptop:h-auto laptop:w-[779px] laptop:rounded-xl laptop:border laptop:border-neutral-600 laptop:bg-neutral-900 laptop:px-0'>
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
                        <div className='flex flex-col gap-3 laptop:px-4'>
                            <input
                                className='typography-mobile-body-4 laptop:typography-desktop-body-4 rounded-lg border border-neutral-500 !bg-neutral-900 px-3 py-2 text-neutral-300 focus:border-primary-500 active:border-[1.5px]'
                                onChange={e =>
                                    setSearchValue(e.currentTarget.value)
                                }
                                value={searchValue}
                                placeholder='Search products...'
                            />

                            <div className='flex items-center gap-[13.5px]'>
                                <button
                                    className={clsx(
                                        'text-xs leading-5 text-neutral-400',
                                        {
                                            'text-primary-300':
                                                !currentCcy && !isItayose,
                                        }
                                    )}
                                    onClick={() => {
                                        setCurrentCcy(undefined);
                                        setIsItayose(false);
                                    }}
                                >
                                    All
                                </button>
                                <button
                                    className={clsx(
                                        'text-xs leading-5 text-neutral-400',
                                        {
                                            'text-primary-300':
                                                isItayose && !currentCcy,
                                        }
                                    )}
                                    onClick={() => {
                                        setCurrentCcy(undefined);
                                        setIsItayose(true);
                                    }}
                                >
                                    Itayose
                                </button>
                                {currencies?.map(ccy => (
                                    <button
                                        key={`currency-${ccy}`}
                                        className={clsx(
                                            'text-xs leading-5 text-neutral-400',
                                            {
                                                'text-primary-300':
                                                    currentCcy === ccy,
                                            }
                                        )}
                                        onClick={() => {
                                            setCurrentCcy(ccy);
                                            setIsItayose(false);
                                        }}
                                    >
                                        {ccy}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Table
                            aria-label='Currency Maturity Dropdown'
                            selectionMode='single'
                            removeWrapper
                            isHeaderSticky
                            classNames={{
                                base: 'laptop:max-h-[232px] overflow-auto laptop:pl-4 laptop:pr-3',
                                table: 'min-h-[400px]',
                            }}
                        >
                            <TableHeader columns={tableHeaderColumns}>
                                {column => (
                                    <TableColumn
                                        className='relative h-5 !rounded-none bg-neutral-800 px-0 text-xs font-normal leading-5 text-neutral-400 laptop:bg-neutral-900'
                                        key={column.key}
                                    >
                                        {column.label}
                                        <span className='absolute bottom-0 left-0 h-[1px] w-full bg-neutral-700'></span>
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={currencyOptions}>
                                {item => {
                                    if (!item) return <></>;
                                    return (
                                        <TableRow
                                            key={item.key}
                                            className='cursor-pointer overflow-hidden rounded border-b border-neutral-600 laptop:border-b-0 laptop:hover:bg-neutral-700'
                                            onClick={() => {
                                                if (
                                                    item.currency !==
                                                        asset.value ||
                                                    item.maturity !==
                                                        maturity.value
                                                ) {
                                                    onChange(
                                                        item.currency,
                                                        item.maturity
                                                    );
                                                }
                                                close();
                                            }}
                                        >
                                            {columnKey => (
                                                <TableCell className='px-0 py-2 text-xs leading-5 text-neutral-50'>
                                                    {renderCell(
                                                        item,
                                                        `${columnKey}`
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                }}
                            </TableBody>
                        </Table>
                    </Menu.Items>
                </div>
            )}
        </Menu>
    );
};
