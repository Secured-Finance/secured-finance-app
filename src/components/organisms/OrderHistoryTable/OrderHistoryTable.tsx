import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable, TableActionMenu } from 'src/components/molecules';
import { useCancelOrder } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { OrderList } from 'src/types';
import { CurrencySymbol, toCurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';
import { hexToString } from 'web3-utils';

export type Order = OrderList[0];

const columnHelper = createColumnHelper<Order>();

export const OrderHistoryTable = ({ data }: { data: OrderList }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const { handleCancelOrder } = useCancelOrder();

    const columns = useMemo(
        () => [
            loanTypeColumnDefinition(columnHelper, 'Type', 'type'),
            contractColumnDefinition(columnHelper, 'Contract', 'contract'),
            priceYieldColumnDefinition(
                columnHelper,
                'Price',
                'price',
                row => row.unitPrice
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
                { compact: false, color: true, priceList: priceList }
            ),
            columnHelper.accessor('status', {
                cell: info => <div>{info.getValue().toString()}</div>,
                header: tableHeaderDefinition('Status'),
            }),
            columnHelper.display({
                id: 'actions',
                cell: info => {
                    return (
                        <div className='flex justify-center'>
                            <TableActionMenu
                                items={[
                                    {
                                        text: 'Edit Order',
                                        onClick: () => {},
                                        disabled: true,
                                    },
                                    {
                                        text: 'Cancel Order',
                                        onClick: () =>
                                            handleCancelOrder(
                                                Number(info.row.original.id),
                                                toCurrencySymbol(
                                                    hexToString(
                                                        info.row.original
                                                            .currency
                                                    )
                                                ) ?? CurrencySymbol.FIL,
                                                new Maturity(
                                                    info.row.original.maturity
                                                )
                                            ),
                                    },
                                ]}
                            />
                        </div>
                    );
                },
                header: () => <div>Actions</div>,
            }),
        ],
        [handleCancelOrder, priceList]
    );

    return <CoreTable columns={columns} data={data} border />;
};
