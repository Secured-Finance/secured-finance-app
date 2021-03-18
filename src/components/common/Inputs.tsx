import React from 'react'
import styled, { css } from 'styled-components'
import theme from '../../theme'

export interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string | Array<string>,
    onChange: (event: React.FormEvent<HTMLInputElement>) => void,
    icon?: string
}

export const sharedInputStyles = css`
    background-color: ${theme.colors.darkenedBg};
    color: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.sfBlue1100};
    border-radius: ${theme.sizes.radius}px;
    font-size: ${theme.sizes.caption}px;
    padding: 10px 12px;
    margin-bottom: ${theme.spacing[2]}px;

  :focus {
    outline: none;
    border-color: ${theme.colors.sfBlue900};
  }
`

const InputField = styled.input`
  ${sharedInputStyles};
  width: calc(100% - 24px);
`

export const Label = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${theme.sizes.caption}px;
    color: ${theme.colors.lightBackground};
    line-height: 14px;
    margin-bottom: ${theme.spacing[2]}px;
`

const InputContainer = styled.div`
    margin-bottom: ${theme.spacing[3]}px;
`

export const Input: React.FC<IInput> = ({label, icon, ...props}) => {
    return typeof label === "string" ? (
        <InputContainer>
            <Label> {label}
            </Label>
            <InputField {...props} />
        </InputContainer>
   ) : (
       <InputContainer>
       <Label>
           <span>{label[0]}</span>
           <span style={{color: theme.colors.cellKey}}>{label[1]}</span>
       </Label>
           <InputField {...props} />
       </InputContainer>
   )
}