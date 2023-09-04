import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, DropdownSelector } from 'src/components/atoms';
import { CoreTable, Tab } from 'src/components/molecules';
import { Market, useMarketLists, useMaturityOptions } from 'src/hooks';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import {
    CurrencySymbol,
    formatLoanValue,
    getCurrencyMapAsOptions,
    toCurrencySymbol,
} from 'src/utils';
import { countdown } from 'src/utils/date';
import { LoanValue } from 'src/utils/entities';
import {
    contractColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

const columnHelper = createColumnHelper<Market>();

export const MarketLoanWidget = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { openMarkets, itayoseMarkets } = useMarketLists();

    const [selectedCurrency, setSelectedCurrency] = useState<
        CurrencySymbol | ''
    >();
    const [selectedTerm, setSelectedTerm] = useState<number>();

    const getFilteredMarkets = useCallback(
        (markets: Market[]) => {
            if (!selectedCurrency && !selectedTerm) {
                return markets;
            }

            if (markets.length === 0) {
                return [];
            }

            if (markets[0].isItayosePeriod || markets[0].isPreOrderPeriod) {
                return markets.filter(
                    market =>
                        !selectedCurrency || market.ccy === selectedCurrency
                );
            }

            return markets.filter(
                market =>
                    (!selectedCurrency || market.ccy === selectedCurrency) &&
                    (!selectedTerm || market.maturity === selectedTerm)
            );
        },
        [selectedCurrency, selectedTerm]
    );

    const maturityOptionList = useMaturityOptions(openMarkets);

    const handleClick = useCallback(
        (info: CellContext<Market, string>) => {
            const ccy = fromBytes32(info.getValue()) as CurrencySymbol;
            dispatch(setMaturity(Number(info.row.original.maturity)));
            dispatch(setCurrency(ccy));

            info.row.original.isOpened
                ? router.push('/advanced/')
                : router.push('/itayose/');
        },
        [dispatch, router]
    );

    const columns = useMemo(
        () => [
            contractColumnDefinition(
                columnHelper,
                'Asset',
                'contract',
                'currencyOnly'
            ),
            columnHelper.accessor('maturity', {
                id: 'maturity',
                cell: info => {
                    return (
                        <div className=' grid w-full whitespace-nowrap'>
                            <div className='typography-caption text-neutral-8'>
                                {getUTCMonthYear(info.getValue())}
                            </div>
                            <div className='typography-caption-2 text-slateGray'>
                                {formatDate(info.getValue())}
                            </div>
                        </div>
                    );
                },
                header: tableHeaderDefinition('Maturity'),
            }),
            columnHelper.accessor('midUnitPrice', {
                id: 'apr',
                cell: info => {
                    return (
                        <div className='typography-body-2 flex justify-center px-1'>
                            {info.getValue() && info.row.original.maturity
                                ? formatLoanValue(
                                      LoanValue.fromPrice(
                                          info.getValue(),
                                          info.row.original.maturity
                                      ),
                                      'rate'
                                  )
                                : 'N/A'}
                        </div>
                    );
                },
                header: tableHeaderDefinition('APR'),
            }),
            columnHelper.accessor('utcOpeningDate', {
                id: 'openingDate',
                cell: info => {
                    return (
                        <div>{`starts in ${countdown(
                            info.getValue() * 1000
                        )}`}</div>
                    );
                },
                enableHiding: true,
                header: tableHeaderDefinition('Market Open'),
            }),
            columnHelper.accessor('currency', {
                id: 'action',
                cell: info => {
                    return (
                        <div className='flex w-20 justify-start px-1'>
                            <Button onClick={() => handleClick(info)} size='sm'>
                                {info.row.original.isOpened
                                    ? 'Open Order'
                                    : 'Pre-Open Order'}
                            </Button>
                        </div>
                    );
                },
                header: tableHeaderDefinition('Action'),
            }),
        ],
        [handleClick]
    );

    const assetDropdown = (
        <DropdownSelector<string>
            optionList={[
                { label: 'All Assets', value: '' },
                ...getCurrencyMapAsOptions(),
            ]}
            onChange={v => setSelectedCurrency(toCurrencySymbol(v))}
        />
    );

    const maturityDropdown = (
        <DropdownSelector
            optionList={[
                { label: 'All', value: '' },
                ...maturityOptionList.map(o => ({
                    label: o.label,
                    value: o.value.toString(),
                })),
            ]}
            selected={{
                ...maturityOptionList[0],
                value: maturityOptionList[0].value.toString(),
            }}
            onChange={v => {
                const maturity = parseInt(v);
                setSelectedTerm(maturity);
            }}
        />
    );

    const tabDataArray = [
        { text: 'Loans', utilsArray: [assetDropdown, maturityDropdown] },
        {
            text: 'Pre-Open',
            highlighted: true,
            utilsArray: [
                <div className='hidden tablet:block' key='asset'>
                    {assetDropdown}
                </div>,
            ],
        },
    ];

    return (
        <div className='h-fit rounded-b-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <Tab tabDataArray={tabDataArray}>
                <div className='p-6 pt-3'>
                    <CoreTable
                        columns={columns}
                        data={getFilteredMarkets(openMarkets)}
                        options={{
                            border: false,
                            hideColumnIds: ['openingDate'],
                            stickyColumns: new Set([3]),
                        }}
                    />
                </div>
                <div className='p-6 pt-3'>
                    <CoreTable
                        columns={columns}
                        data={getFilteredMarkets(itayoseMarkets)}
                        options={{
                            border: false,
                            hideColumnIds: ['apr'],
                            stickyColumns: new Set([3]),
                        }}
                    />
                </div>
            </Tab>
        </div>
    );
};
