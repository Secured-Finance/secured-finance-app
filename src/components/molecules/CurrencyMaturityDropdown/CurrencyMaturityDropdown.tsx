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
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { CloseButton, Option } from 'src/components/atoms';
import {
    baseContracts,
    useBreakpoint,
    useGraphClientHook,
    useIsSubgraphSupported,
    useLastPrices,
    useLendingMarkets,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    calculateTimeDifference,
    currencyMap,
    formatDuration,
    formatLoanValue,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { columns, mobileColumns } from './constants';
import { ColumnKey, CurrencyMaturityCategories } from './types';

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
    const { data: priceList } = useLastPrices();

    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    const dailyVolumes = useGraphClientHook(
        {}, // no variables
        queries.DailyVolumesDocument,
        'dailyVolumes',
        !isSubgraphSupported
    );

    const transactionHistory = useGraphClientHook(
        {
            currency: '',
            maturity: '',
            from: Math.round(
                (new Date().getTime() - 90 * 24 * 60 * 60 * 1000) / 1000
            ),
            to: Math.round(new Date().getTime() / 1000),
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    );

    console.log(transactionHistory);

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

            const totalVolumeInUSD = (dailyVolumes.data ?? [])
                .filter(
                    item =>
                        item.currency === toBytes32(ccy) &&
                        item.maturity === maturity
                )
                .reduce((sum, item) => {
                    const volumeInBaseUnit = currencyMap[ccy].fromBaseUnit(
                        BigInt(item.volume)
                    );
                    const valueInUSD = volumeInBaseUnit * priceList[ccy];
                    return sum + BigInt(Math.floor(valueInUSD));
                }, BigInt(0));

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
                    // TODO: handle decimal places
                    return <span>{usdFormat(Number(totalVolumeInUSD))}</span>;
                case 'apr':
                    return formatLoanValue(lastPrice, 'rate');
                case 'maturity':
                    const timestampDifference = calculateTimeDifference(
                        +maturity
                    );
                    return formatDuration(Math.abs(timestampDifference));
            }
        },
        [lendingMarkets, dailyVolumes.data, priceList]
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
                            isHeaderSticky
                            classNames={{
                                base: 'max-h-[232px] overflow-auto',
                                table: 'min-h-[400px]',
                            }}
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
