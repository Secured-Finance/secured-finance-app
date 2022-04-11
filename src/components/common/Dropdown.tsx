import React from 'react';
import { Label, sharedInputStyles } from './Inputs';
import ChevronDown from 'src/assets/icons/ChevronDown.svg';
import styled from 'styled-components';
import { Term } from 'src/utils';
import theme from 'src/theme';

interface IDropdown extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    value: string;
    onChangeValue: (event: React.FormEvent<HTMLSelectElement>) => void;
    options: Term[];
}

const DropdownSelect = styled.select`
    ${sharedInputStyles};
    width: 100%;
    cursor: pointer;

    // hide arrow
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';

    // for IE
    ::-ms-expand {
        display: none;
    }
`;

const DropdownContainer = styled.div`
    position: relative;
    margin-bottom: ${theme.spacing[2]}px;
`;

export const Icon = styled.img`
    position: absolute;
    right: 6px;
    top: 50%;
    cursor: pointer;
`;

export const Dropdown: React.FC<IDropdown> = ({
    options,
    onChangeValue,
    value,
    label,
}) => {
    return (
        <DropdownContainer>
            <Label>{label}</Label>
            <DropdownSelect onChange={onChangeValue} value={value}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </DropdownSelect>
            <Icon src={ChevronDown} />
        </DropdownContainer>
    );
};
