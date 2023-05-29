import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable } from 'src/components/molecules';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { OrderList } from 'src/types';
import {
    amountColumnDefinition,
    contractColumnDefinition,
    loanTypeColumnDefinition,
    priceYieldColumnDefinition,
    tableHeaderDefinition,
} from 'src/utils/tableDefinitions';

export type Order = OrderList[0];

const columnHelper = createColumnHelper<Order>();

export const OrderHistoryTable = ({ data }: { data: OrderList }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

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
        ],
        [priceList]
    );

    return <CoreTable columns={columns} data={data} border />;
};
