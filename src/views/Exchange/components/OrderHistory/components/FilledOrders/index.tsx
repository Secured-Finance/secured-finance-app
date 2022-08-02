import React from 'react';
import { Currency } from 'src/utils';
import { useTradeHistoryOrders } from '../../../../../../hooks/useUserOrders';
import FilledOrdersTable from './FilledOrdersTable';

interface OpenOrdersProps {
    ccy: string;
    term: string;
}

type MergedProps = OpenOrdersProps;

export const FilledOrders: React.FC<MergedProps> = ({ ccy, term }) => {
    const data = useTradeHistoryOrders(
        ccy ? (ccy as Currency) : Currency.ETH,
        term
    );

    return <FilledOrdersTable table={data} />;
};
