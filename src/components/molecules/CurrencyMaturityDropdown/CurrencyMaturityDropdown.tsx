import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CloseButton, Option } from 'src/components/atoms';
import {
    ContractMap,
    baseContracts,
    useBreakpoint,
    useGraphClientHook,
    useIsSubgraphSupported,
    useLendingMarkets,
    useMaturityOptions,
    useTradeHistoryDetails,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    calculateTimeDifference,
    currencyMap,
    formatLoanValue,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { columns, mobileColumns } from './constants';
import { ColumnKey, CurrencyMaturityCategories } from './types';

export const PriceChange = ({
    currency,
    maturity,
    lendingContracts,
    index,
}: {
    currency: CurrencySymbol;
    maturity: Maturity;
    lendingContracts: ContractMap;
    index: number;
}) => {
    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

    const transactionHistory = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: timestamp - 24 * 3600,
            to: timestamp,
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    ).data;

    const selectedTerm = useMemo(() => {
        return (
            maturityOptionList.find(option =>
                option.value.equals(new Maturity(+maturity))
            ) || maturityOptionList[0]
        );
    }, [maturity, maturityOptionList]);

    const tradeHistoryDetails = useTradeHistoryDetails(
        transactionHistory ?? [],
        currency,
        selectedTerm.value
    );

    let values = undefined;

    if (isSubgraphSupported) {
        values = [
            formatLoanValue(tradeHistoryDetails.max, 'price'),
            formatLoanValue(tradeHistoryDetails.min, 'price'),
            tradeHistoryDetails.count.toString(),
            tradeHistoryDetails.sum
                ? ordinaryFormat(tradeHistoryDetails.sum)
                : '-',
        ];
    }

    return <span>{values && values[index] ? values[index] : 0}</span>;
};

export const CurrencyMaturityDropdown = ({
    currencyList,
    asset = currencyList[0],
    maturityList,
    maturity = maturityList[0],
    onChange,
}: {
    currencyList: Option<CurrencySymbol>[];
    asset?: Option<CurrencySymbol>;
    maturityList: MaturityOptionList;
    maturity?: Option<Maturity>;
    onChange: (
        currency: CurrencySymbol,
        maturity: Option<Maturity>['value']
    ) => void;
}) => {
    const isTablet = useBreakpoint('laptop');
    const [searchValue, setSearchValue] = useState<string | undefined>('');
    const [category, setCategory] = useState<CurrencyMaturityCategories>(
        CurrencyMaturityCategories.All
    );
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();

    const CcyIcon = currencyMap[asset.value].icon;

    const tableHeaderColumns = isTablet ? mobileColumns : columns;

    const currencyOptions = currencyList.flatMap(ccy =>
        maturityList.map(maturity => {
            const ccyMaturity = `${ccy.label}-${maturity.label}`;
            return {
                key: ccyMaturity,
                display: ccyMaturity,
                currency: ccy.value,
                maturity: maturity.value,
            };
        })
    );

    function formatDuration(durationMs: number): string {
        const msPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        const daysInYear = 365.25; // Average number of days in a year accounting for leap years

        // Calculate the duration in days
        const durationInDays = durationMs / msPerDay;

        // Calculate the fraction of the year
        const fractionOfYear = durationInDays / daysInYear;

        // Format the fraction of year to two decimal places
        const fractionOfYearFormatted = fractionOfYear.toFixed(2);

        // Return the formatted string
        return `${fractionOfYearFormatted}Y (${Math.round(
            durationInDays
        )} days)`;
    }

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
                            <StarIcon className='h-3.5 w-3.5' />
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
                case 'volume':
                    return (
                        <PriceChange
                            currency={ccy}
                            maturity={maturity}
                            lendingContracts={lendingMarkets[ccy]}
                            index={3}
                        />
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
                    <Menu.Button className='flex w-full items-center justify-between gap-2 rounded-lg bg-neutral-700 px-2 py-1.5 text-sm font-semibold leading-6 text-white laptop:max-w-[302px] laptop:py-2.5 laptop:pl-3'>
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
                    <Menu.Items className='fixed left-0 top-[56px] z-[28] flex w-full flex-col gap-3 overflow-hidden border-t-4 border-primary-500 bg-neutral-800 px-4 pt-3 laptop:absolute laptop:left-auto laptop:top-auto laptop:mt-1.5 laptop:w-[779px] laptop:rounded-xl laptop:border laptop:border-neutral-600 laptop:bg-neutral-900'>
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
                        <input
                            className='rounded-lg border border-neutral-500 !bg-neutral-900 px-3 py-2 text-neutral-300 focus:border-primary-500 active:border-[1.5px]'
                            onChange={e =>
                                setSearchValue(e.currentTarget.value)
                            }
                            value={searchValue}
                            placeholder='Search products...'
                        />

                        <div className='flex items-center gap-[13.5px]'>
                            {Object.entries(CurrencyMaturityCategories).map(
                                ([key, value]) => (
                                    <button
                                        key={key}
                                        className={clsx(
                                            'text-xs leading-5 text-neutral-400',
                                            {
                                                'text-primary-300':
                                                    category === value,
                                            }
                                        )}
                                        onClick={() => setCategory(value)}
                                    >
                                        {value}
                                    </button>
                                )
                            )}
                        </div>

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
                                            if (
                                                item.currency !== asset.value &&
                                                item.maturity !== maturity.value
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
                                )}
                            </TableBody>
                        </Table>
                    </Menu.Items>
                </div>
            )}
        </Menu>
    );
};

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

// return {
//     value: LoanValue.fromPrice(
//         openingUnitPrice,
//         maturity
//     ),
//     time: 0,
//     type: 'opening' as const,
// };

// return {
//     value: LoanValue.fromPrice(
//         marketUnitPrice,
//         maturity
//     ),
//     time: data?.lastBlockUnitPriceTimestamp ?? 0,
//     type: 'block' as const,
// };
