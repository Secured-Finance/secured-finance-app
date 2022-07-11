import React from 'react';
import theme from 'src/theme';
import { TermInfo } from 'src/utils';
import styled from 'styled-components';
import { Label, sharedInputStyles } from './Inputs';

interface IDropdown extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    value: string;
    onChangeValue: (event: React.FormEvent<HTMLSelectElement>) => void;
    options: TermInfo[];
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
            <Icon src={'ChevronDown'} />
        </DropdownContainer>
    );
};
