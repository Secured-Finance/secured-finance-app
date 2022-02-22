import {
    Cell,
    CellKey,
    CellValue,
    Table,
} from '../../../../../components/common/Table';
import React from 'react';

export const InfoTable = () => {
    return (
        <Table>
            <Cell>
                <CellKey>Available to lend</CellKey>
                <CellValue>0 FIL</CellValue>
            </Cell>
            <Cell>
                <CellKey>Order Amount (USD)</CellKey>
                <CellValue>0$</CellValue>
            </Cell>
            <Cell>
                <CellKey>Estimated returns</CellKey>
                <CellValue>0$</CellValue>
            </Cell>
            <Cell>
                <CellKey>FIL Balance after trade</CellKey>
                <CellValue>0 FIL</CellValue>
            </Cell>
            <Cell>
                <CellKey>Transaction fee</CellKey>
                <CellValue>1.2$</CellValue>
            </Cell>
        </Table>
    );
};
