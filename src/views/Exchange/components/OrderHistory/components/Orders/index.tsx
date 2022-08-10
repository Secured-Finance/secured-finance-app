import React from 'react';
import { CurrencySymbol } from 'src/utils';
import { useOpenOrders } from '../../../../../../hooks/useUserOrders';
import OrdersTable from './OrdersTable';

interface OpenOrdersProps {
    ccy: string;
    term: string;
}

type MergedProps = OpenOrdersProps;

export const OpenOrders: React.FC<MergedProps> = ({ ccy, term }) => {
    const data = useOpenOrders(
        ccy ? (ccy as CurrencySymbol) : CurrencySymbol.ETH,
        term
    );

    return <OrdersTable table={data} />;
};
