import React from 'react';
import { useTradeHistoryOrders } from '../../../../../../hooks/useUserOrders';
import FilledOrdersTable from './FilledOrdersTable';

interface OpenOrdersProps {
    ccy?: number;
    term?: number;
}

type MergedProps = OpenOrdersProps;

export const FilledOrders: React.FC<MergedProps> = ({ ccy, term }) => {
    const data = useTradeHistoryOrders(ccy, term);

    return <FilledOrdersTable table={data} />;
};
