import React from 'react';
import { Currency } from 'src/utils';
import { useOpenOrders } from '../../../../../../hooks/useUserOrders';
import OrdersTable from './OrdersTable';

interface OpenOrdersProps {
    ccy: string;
    term: string;
}

type MergedProps = OpenOrdersProps;

export const OpenOrders: React.FC<MergedProps> = ({ ccy, term }) => {
    const data = useOpenOrders(ccy ? (ccy as Currency) : Currency.ETH, term);

    return <OrdersTable table={data} />;
};
