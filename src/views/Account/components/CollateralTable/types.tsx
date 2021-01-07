import { formatAddress } from "../../../../utils";
import CurrencyContainer from "../../../../components/CurrencyContainer";
import React from "react";
import { RenderCollateral, RenderBorrow, RenderActions, RenderRatio } from "./components";

export interface TableColumns {
    Header: string,
    id: string,
    isHiddenHeader: boolean,
    columns: Array<Columns>,
    isSorted?: boolean,
    isSortedDesc?: boolean,
}

interface Columns {
    Header: string,
    accessor: string,
    Cell: any,
}

export const collateralTableColumns = [{
    Header: '',
    id: 'collateral',
    isHiddenHeader: false,
    columns: [
        {
            Header: 'Asset',
            accessor: 'ccyIndex',
            Cell: ( cell: { value: number } ) => <CurrencyContainer index={cell.value} short={false} wallet={true}/>
        },
        {
            Header: 'Vault',
            accessor: 'vault',
            Cell: ( cell: { value: string } ) => <span>{formatAddress(cell.value, 24)}</span>
        },
        {
            Header: 'Collateral',
            accessor: 'collateral',
            Cell: ( cell : { value: any, row: any } ) => <RenderCollateral collateral={cell.value} index={cell.row.values.ccyIndex} value={cell.row.original.usdValue}/>
        },
        {
            Header: 'Borrow',
            accessor: 'borrow',
            Cell: ( cell : { value: any, row: any } ) => <RenderBorrow borrow={cell.value} dailyChange={cell.row.original.dailyChange}/>
        },
        {
            Header: 'Health ratio',
            accessor: 'health',
            Cell: ( cell : { value: any } ) => <RenderRatio ratio={cell.value}/>
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: (cell: {value: any, row: any }) => <RenderActions ccyIndex={cell.row.values.ccyIndex}/>
        },
    ]
}] as Array<TableColumns>