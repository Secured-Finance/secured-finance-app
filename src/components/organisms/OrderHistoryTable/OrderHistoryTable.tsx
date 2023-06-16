import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CoreTable } from 'src/components/molecules';
import { useBreakpoint } from 'src/hooks';
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

const getStatus = (status: string) => {
    return status === 'PartiallyFilled' ? 'Partially Filled' : status;
};

export const OrderHistoryTable = ({ data }: { data: OrderList }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const isTablet = useBreakpoint('tablet');

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
                'Filled Amount',
                'filledAmount',
                row => row.filledAmount,
                { compact: false, color: true, priceList: priceList }
            ),
            amountColumnDefinition(
                columnHelper,
                'Amount',
                'amount',
                row => row.amount,
                { compact: false, color: true, priceList: priceList }
            ),
            columnHelper.accessor('status', {
                cell: info => <div>{getStatus(info.getValue())}</div>,
                header: tableHeaderDefinition('Status'),
            }),
        ],
        [priceList]
    );

    const columnsForTabletMobile = [
        columns[1],
        columns[0],
        ...columns.slice(2),
    ];

    return (
        <CoreTable
            columns={isTablet ? columnsForTabletMobile : columns}
            data={data}
            options={{ stickyColumns: new Set([0, 1]) }}
        />
    );
};
