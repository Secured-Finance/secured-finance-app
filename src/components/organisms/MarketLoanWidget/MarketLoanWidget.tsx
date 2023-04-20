import { formatDate, getUTCMonthYear } from '@secured-finance/sf-core';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, DropdownSelector, NavTab, Option } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import { LendingMarket } from 'src/hooks';
import { setCurrency, setMaturity } from 'src/store/landingOrderForm';
import { MarketPhase } from 'src/store/landingOrderForm/reducer';
import {
    CurrencySymbol,
    formatLoanValue,
    getCurrencyMapAsOptions,
    toCurrencySymbol,
} from 'src/utils';
import { countdown } from 'src/utils/date';
import { LoanValue, Maturity } from 'src/utils/entities';
import {
    contractColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';
export type Loan = LendingMarket & {
    currency: string;
    ccy: CurrencySymbol;
    phase: MarketPhase;
};
const columnHelper = createColumnHelper<Loan>();

export const MarketLoanWidget = ({ loans }: { loans: Loan[] }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [selectedCurrency, setSelectedCurrency] = useState<
        CurrencySymbol | ''
    >();
    const [selectedTerm, setSelectedTerm] = useState<number>();
    const [isItayoseMarket, setIsItayoseMarket] = useState(false);
    const filteredLoans = useMemo(
        () =>
            loans.filter(
                loan =>
                    (!selectedCurrency || loan.ccy === selectedCurrency) &&
                    (!selectedTerm || loan.maturity === selectedTerm)
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(loans), selectedCurrency, selectedTerm]
    );

    const maturityOptionList = useMemo(
        () => {
            const res: Option<string>[] = [];

            loans.forEach(loan => {
                if (!res.find(m => m.value === loan.maturity.toString())) {
                    res.push({
                        label: loan.name,
                        value: loan.maturity.toString(),
                    });
                }
            });

            return res;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(loans)]
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
                        <div className='flex flex-col items-start'>
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
                        <div className='typography-body-2 flex justify-center'>
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
                        <div className='flex justify-center'>
                            <Button
                                disabled={
                                    info.row.original.phase === 'Closed' ||
                                    info.row.original.phase === 'Itayose'
                                }
                                onClick={() => {
                                    const ccy = fromBytes32(
                                        info.getValue()
                                    ) as CurrencySymbol;
                                    dispatch(
                                        setMaturity(
                                            new Maturity(
                                                info.row.original.maturity
                                            )
                                        )
                                    );
                                    dispatch(setCurrency(ccy));
                                    info.row.original.isReady
                                        ? router.push('/advanced/')
                                        : router.push('/itayose/');
                                }}
                            >
                                {info.row.original.isReady
                                    ? 'Open Order'
                                    : 'Pre-Open Order'}
                            </Button>
                        </div>
                    );
                },
                header: tableHeaderDefinition('Action'),
            }),
        ],
        [dispatch, router]
    );
    return (
        <div className='h-fit rounded-2xl border border-white-10 bg-cardBackground/60 shadow-tab'>
            <div className='flex flex-row justify-between border-b border-neutral-3 pb-2'>
                <div className='h-16 w-28'>
                    <NavTab text='Loans' active />
                </div>
                <div className='flex flex-row gap-3 pt-4 pr-3'>
                    <DropdownSelector<string>
                        optionList={[
                            { label: 'All Assets', value: '' },
                            ...getCurrencyMapAsOptions(),
                        ]}
                        onChange={v => setSelectedCurrency(toCurrencySymbol(v))}
                    />
                    <DropdownSelector
                        optionList={maturityOptionList}
                        selected={maturityOptionList[0]}
                        onChange={v => {
                            const maturity = parseInt(v);
                            setSelectedTerm(maturity);
                            for (const loan of loans) {
                                if (loan.maturity === maturity) {
                                    if (!loan.isReady) {
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
            <div className='p-6'>
                <CoreTable
                    columns={columns}
                    data={filteredLoans}
                    border={false}
                    hideColumnIds={isItayoseMarket ? ['apr'] : ['openingDate']}
                />
            </div>
        </div>
    );
};
