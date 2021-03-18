import React from 'react'
import { Label, sharedInputStyles } from "./Inputs"
import ChevronDown from "../../assets/icons/ChevronDown.svg"
import styled from 'styled-components'
import { Terms } from '../../utils'
import theme from '../../theme'

interface IDropdown extends React.SelectHTMLAttributes<HTMLSelectElement>{
    label: string,
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
    margin-bottom: ${theme.spacing[3]}px;
`

export const Icon = styled.img`
  position: absolute;
  right: 6px;
  top: calc(50% - 6px);
  cursor: pointer;
`

export const Dropdown: React.FC<IDropdown> = ({options, label,...props}) => {
    return <DropdownContainer>
        <Label>{label}</Label>
        <DropdownSelect>
            {options.map(option =>  <option>{option.text}</option>)}
        </DropdownSelect>
        <Icon src={ChevronDown} />
    </DropdownContainer>
}