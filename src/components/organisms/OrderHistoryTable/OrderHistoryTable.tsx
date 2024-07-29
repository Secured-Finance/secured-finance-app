import { OrderSide } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo } from 'react';
import { HorizontalListItemTable } from 'src/components/atoms';
import {
    CoreTable,
    Pagination,
    TableActionMenu,
    TableCardHeader,
} from 'src/components/molecules';
import { useBlockExplorerUrl, useBreakpoint, useLastPrices } from 'src/hooks';
import { Order, OrderHistoryList } from 'src/types';
import {
    AmountCell,
    MobileTableWrapper,
    OrderTimeCell,
    TextCell,
    amountColumnDefinition,
    contractColumnDefinition,
    dateAndTimeColumnDefinition,
    hexToCurrencySymbol,
    inputAmountColumnDefinition,
    inputPriceYieldColumnDefinition,
    loanTypeColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';

const columnHelper = createColumnHelper<Order>();

const OrderHistoryTableMobile = ({
    data,
    blockExplorerUrl,
}: {
    data: Order[];
    blockExplorerUrl: string;
}) => {
    return (
        <MobileTableWrapper>
            {data.map((row, index) => {
                const ccy = hexToCurrencySymbol(row.currency);
                const maturity = new Maturity(row.maturity);
                const side =
                    row.side.toString() === '1'
                        ? OrderSide.BORROW
                        : OrderSide.LEND;
                const inputAmount = row.inputAmount;
                const filledAmount = row.filledAmount;
                const unitPrice = row.inputUnitPrice;
                const status = row.status;
                const timestamp = Number(row.createdAt);
                const txHash = row.txHash;
                const blockExplorerLink = blockExplorerUrl
                    ? `${blockExplorerUrl}/tx/${txHash}`
                    : '';

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
                                price={Number(unitPrice)}
                                displayMarketPrice
                            />
                            <div className='flex flex-col'>
                                <HorizontalListItemTable
                                    label='Order Amount'
                                    value={
                                        <AmountCell
                                            ccy={ccy}
                                            amount={inputAmount}
                                        />
                                    }
                                />
                                <HorizontalListItemTable
                                    label='Filled Amount'
                                    value={
                                        <AmountCell
                                            ccy={ccy}
                                            amount={filledAmount}
                                        />
                                    }
                                />
                                <HorizontalListItemTable
                                    label='Status'
                                    value={<TextCell text={status} />}
                                />
                                <HorizontalListItemTable
                                    label='Order Time'
                                    value={
                                        <OrderTimeCell
                                            timestamp={timestamp}
                                            blockExplorerLink={
                                                blockExplorerLink
                                            }
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

export const OrderHistoryTable = ({
    data,
    pagination,
    variant = 'default',
}: {
    data: OrderHistoryList;
    pagination?: Pagination;
    variant?: 'compact' | 'default';
}) => {
    const { data: priceList } = useLastPrices();
    const isTablet = useBreakpoint('laptop');
    const { blockExplorerUrl } = useBlockExplorerUrl();

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
            inputPriceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.inputUnitPrice
            ),
            inputAmountColumnDefinition(
                columnHelper,
                'Order Amount',
                'amount',
                row => row.inputAmount,
                {
                    compact: true,
                    color: false,
                    priceList: priceList,
                    fontSize: 'typography-desktop-body-5',
                }
            ),
            amountColumnDefinition(
                columnHelper,
                'Filled Amount',
                'filledAmount',
                row => row.filledAmount,
                {
                    compact: true,
                    color: false,
                    priceList: priceList,
                    fontSize: 'typography-desktop-body-5',
                },
                '',
                'right'
            ),
            columnHelper.accessor('status', {
                cell: info => (
                    <div className='typography-desktop-body-5 flex justify-start text-white'>
                        {info.getValue()}
                    </div>
                ),
                header: tableHeaderDefinition('Status', '', 'left'),
            }),
            dateAndTimeColumnDefinition(
                columnHelper,
                'Order Time',
                'createdAt',
                row => row.createdAt
            ),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    const txHash = info.row.original.txHash;
                    const blockExplorerLink = blockExplorerUrl
                        ? `${blockExplorerUrl}/tx/${txHash}`
                        : '';
                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'View',
                                        onClick: () => {
                                            window.open(
                                                blockExplorerLink,
                                                '_blank'
                                            );
                                        },
                                    },
                                ]}
                            />
                        </div>
                    );
                },
                header: () => <div className='p-2'>Actions</div>,
            }),
        ],
        [blockExplorerUrl, priceList, variant]
    );

    return isTablet ? (
        <OrderHistoryTableMobile
            data={data}
            blockExplorerUrl={blockExplorerUrl}
        />
    ) : (
        <CoreTable
            columns={columns}
            data={data}
            options={{
                name: 'order-history-table',
                stickyFirstColumn: true,
                pagination: pagination,
                border: false,
                compact: true,
            }}
        />
    );
};
