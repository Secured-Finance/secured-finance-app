import React from 'react';
import { useOpenOrders } from '../../../../../../hooks/useUserOrders';
import OrdersTable from './OrdersTable';

interface OpenOrdersProps {
    ccy?: number;
    term?: number;
}

type MergedProps = OpenOrdersProps;

export const OpenOrders: React.FC<MergedProps> = ({ ccy, term }) => {
    const data = useOpenOrders(ccy, term);

    return <OrdersTable table={data} />;
};
