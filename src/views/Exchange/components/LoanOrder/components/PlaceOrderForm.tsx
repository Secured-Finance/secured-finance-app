import React from 'react';
import { Dropdown } from 'src/components/common/Dropdown';
import { Input } from 'src/components/common/Inputs';
import { termList } from 'src/utils';
import { InfoTable } from './InfoTable';

interface IPlaceOrderForm {
    amountFILValue: string;
    onChangeAmountFILValue: (e: React.FormEvent<HTMLInputElement>) => void;
    termValue: string;
    onChangeTerm: (e: React.FormEvent<HTMLSelectElement>) => void;
    insertRateValue: string;
    onChangeInsertRate: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const PlaceOrderForm: React.FC<IPlaceOrderForm> = ({
    amountFILValue,
    onChangeAmountFILValue,
    termValue,
    onChangeTerm,
    insertRateValue,
    onChangeInsertRate,
}) => {
    return (
        <>
            <Input
                label={['Amount FIL', 'Balance: 0.00']}
                type='number'
                placeholder='0'
                value={amountFILValue}
                onChange={onChangeAmountFILValue}
            />
            <Dropdown
                label={'Term'}
                onChangeValue={onChangeTerm}
                value={termValue}
                options={termList}
            />
            <Input
                label={['Interest rate', 'Market Rate: 7.10 %']}
                type='number'
                placeholder='0'
                value={insertRateValue}
                onChange={onChangeInsertRate}
            />

            <InfoTable />
        </>
    );
};
