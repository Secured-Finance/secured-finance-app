import React from 'react'
import { Label, sharedInputStyles } from "./Inputs"
import ChevronDown from "../../assets/icons/ChevronDown.svg"
import styled from 'styled-components'
import { Terms } from '../../utils'
import theme from '../../theme'

interface IDropdown extends React.SelectHTMLAttributes<HTMLSelectElement>{
    label: string,
    value: string,
    onChangeValue: (event: React.FormEvent<HTMLSelectElement>) => void,
    options: Terms[];
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
`

const DropdownContainer = styled.div`
    position: relative;
    margin-bottom: ${theme.spacing[2]}px;
`

export const Icon = styled.img`
  position: absolute;
  right: 6px;
  top: 50%;
  cursor: pointer;
`

export const Dropdown: React.FC<IDropdown> = ({options, onChangeValue, value, label,...props}) => {
    return <DropdownContainer>
        <Label>{label}</Label>
        <DropdownSelect
          onChange={onChangeValue}
          value={value}  
        >
          {options.map(option => <option value={option.term}>{option.text}</option>)}
        </DropdownSelect>
        <Icon src={ChevronDown} />
    </DropdownContainer>
}