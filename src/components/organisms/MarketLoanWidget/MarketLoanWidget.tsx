import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, DropdownSelector, NavTab } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { LendingMarket, useMaturityOptions } from 'src/hooks';
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
type Market = LendingMarket & {
    currency: string;
    ccy: CurrencySymbol;
};
const columnHelper = createColumnHelper<Market>();

export const MarketLoanWidget = ({ markets }: { markets: Market[] }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [selectedCurrency, setSelectedCurrency] = useState<
        CurrencySymbol | ''
    >();
    const [selectedTerm, setSelectedTerm] = useState<number>();
    const [isItayoseMarket, setIsItayoseMarket] = useState(false);
    const filteredLoans = useMemo(
        () =>
            markets.filter(
                loan =>
                    (!selectedCurrency || loan.ccy === selectedCurrency) &&
                    (!selectedTerm || loan.maturity === selectedTerm)
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(markets), selectedCurrency, selectedTerm]
    );

    const maturityOptionList = useMaturityOptions(markets);

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
                        <div className='flex flex-col items-center justify-center whitespace-nowrap px-1'>
                            <div className='flex flex-col items-end justify-end'>
                                <div className='typography-caption text-neutral-8'>
                                    {getUTCMonthYear(info.getValue())}
                                </div>
                                <div className='typography-caption-2 text-slateGray'>
                                    {formatDate(info.getValue())}
                                </div>
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
                        <div className='flex justify-center px-1'>
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
    return (
        <div className='h-fit rounded-b-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <div className='flex flex-col gap-2 border-b border-neutral-3 tablet:flex-row tablet:items-center tablet:justify-between'>
                <div className='h-16 w-full border-b border-neutral-3 tablet:w-28 tablet:border-none'>
                    <NavTab text='Loans' active />
                </div>
                <div className='flex w-full flex-row justify-center gap-4 pb-3 tablet:w-fit tablet:pb-0 tablet:pr-3'>
                    <DropdownSelector<string>
                        optionList={[
                            { label: 'All Assets', value: '' },
                            ...getCurrencyMapAsOptions(),
                        ]}
                        onChange={v => setSelectedCurrency(toCurrencySymbol(v))}
                    />
                    <DropdownSelector
                        optionList={maturityOptionList.map(o => ({
                            label: o.label,
                            value: o.value.toString(),
                        }))}
                        selected={{
                            ...maturityOptionList[0],
                            value: maturityOptionList[0].value.toString(),
                        }}
                        onChange={v => {
                            const maturity = parseInt(v);
                            setSelectedTerm(maturity);
                            for (const loan of markets) {
                                if (loan.maturity === maturity) {
                                    if (
                                        loan.isPreOrderPeriod ||
                                        loan.isItayosePeriod
                                    ) {
                                        setIsItayoseMarket(true);
                                        break;
                                    }
                                }
                                setIsItayoseMarket(false);
                            }
                        }}
                    />
                </div>
            </div>
            <div className='p-6 pt-3'>
                <CoreTable
                    columns={columns}
                    data={filteredLoans}
                    options={{
                        border: false,
                        hideColumnIds: isItayoseMarket
                            ? ['apr']
                            : ['openingDate'],
                        stickyColumns: new Set([3]),
                    }}
                />
            </div>
        </div>
    );
};
