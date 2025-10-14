import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo } from 'react';
import { HorizontalListItemTable } from 'src/components/atoms';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    CompactCoreTable,
    Pagination,
    TableCardHeader,
} from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
import { Transaction, TransactionHistoryList } from 'src/types';
import {
    AmountCell,
    MobileTableWrapper,
    OrderTypeConverter,
    amountColumnDefinition,
    contractColumnDefinition,
    formatter,
    hexToCurrencySymbol,
    loanTypeColumnDefinition,
    tableHeaderDefinition,
    FeeCalculator,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

const columnHelper = createColumnHelper<Transaction>();

const priceYieldColumnDef = (
    headerTitle: string,
    id: string,
    formatType: 'price' | 'rate'
) => {
    return columnHelper.accessor('averagePrice', {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    <span className='typography-caption-2 font-numerical text-white'>
                        {formatter.loanValue(formatType)(
                            LoanValue.fromPrice(
                                Number(
                                    info.getValue().toString() *
                                        FINANCIAL_CONSTANTS.BPS_DIVISOR
                                ), //TODO: remove this hack
                                Number(info.row.original.maturity)
                            )
                        )}
                    </span>
                </div>
            );
        },
        header: tableHeaderDefinition(headerTitle),
    });
};

const MyTransactionsTableMobile = ({
    data,
}: {
    data: TransactionHistoryList;
}) => {
    return (
        <MobileTableWrapper>
            {data.map((row, index) => {
                const ccy = hexToCurrencySymbol(row.currency);
                const maturity = new Maturity(row.maturity);
                const side = OrderTypeConverter.from(row.side);
                const amount = row.amount;
                const averagePrice = row.averagePrice;
                const futureValue = row.futureValue;
                const feeInFV = row.feeInFV;

                return (
                    ccy && (
                        <div
                            className={clsx(
                                'flex w-full flex-col gap-2.5 bg-neutral-900 px-5 py-4',
                                {
                                    'border-b border-neutral-600':
                                        index !== data.length - 1,
                                }
                            )}
                            key={index}
                        >
                            <TableCardHeader
                                currency={ccy}
                                maturity={maturity}
                                side={side}
                                price={
                                    Number(averagePrice) *
                                    FINANCIAL_CONSTANTS.BPS_DIVISOR
                                }
                            />
                            <div className='flex flex-col'>
                                <HorizontalListItemTable
                                    label='Executed Amount'
                                    value={
                                        <AmountCell ccy={ccy} amount={amount} />
                                    }
                                />
                                <HorizontalListItemTable
                                    label='Future Value (FV)'
                                    value={
                                        <AmountCell
                                            ccy={ccy}
                                            amount={FeeCalculator.calculateFutureValueWithFee(
                                                futureValue,
                                                feeInFV,
                                                side
                                            )}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    )
                );
            })}
        </MobileTableWrapper>
    );
};

export const MyTransactionsTable = ({
    data,
    pagination,
    variant = 'compact',
    isLoading = false,
}: {
    data: TransactionHistoryList;
    pagination?: Pagination;
    variant?: 'contractOnly' | 'compact';
    isLoading?: boolean;
}) => {
    const isTablet = useBreakpoint('laptop');
    const columns = useMemo(
        () => [
            contractColumnDefinition(
                columnHelper,
                'Symbol',
                'contract',
                variant,
                undefined,
                'left',
                'left'
            ),
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            priceYieldColumnDef('Price', 'price', 'price'),
            priceYieldColumnDef('APR%', 'apr', 'rate'),
            amountColumnDefinition(
                columnHelper,
                'Executed Amount',
                'amount',
                row => row.amount,
                {
                    compact: true,
                    color: false,
                    fontSize: 'typography-caption-2 font-numerical',
                },
                '',
                'right'
            ),
            amountColumnDefinition(
                columnHelper,
                'Future Value (FV)',
                'futureValue',
                row =>
                    FeeCalculator.calculateFutureValueWithFee(
                        row.futureValue,
                        row.feeInFV,
                        row.side
                    ),
                {
                    compact: true,
                    color: false,
                    fontSize: 'typography-caption-2 font-numerical',
                },
                '',
                'right'
            ),
        ],
        [variant]
    );

    return isTablet ? (
        <MyTransactionsTableMobile data={data} />
    ) : (
        <CompactCoreTable
            data={data}
            columns={columns}
            options={{
                name: 'my-transactions-table',
                pagination: pagination,
            }}
            isLoading={isLoading}
        />
    );
};
