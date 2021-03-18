import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string | Array<string>,
    onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

const InputField = styled.input`
    background-color: ${theme.colors.darkenedBg};
    color: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.sfBlue1100};
    border-radius: ${theme.sizes.radius}px;
    font-size: ${theme.sizes.caption}px;
    padding: 10px 12px;
    width: calc(100% - 24px);
    margin-bottom: ${theme.spacing[2]}px;

  :focus {
    outline: none;
    border-color: ${theme.colors.sfBlue900};
  }
`

const Label = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${theme.sizes.caption}px;
    color: ${theme.colors.lightBackground};
    line-height: 14px;
    margin-bottom: ${theme.spacing[2]}px;
`

export const Input: React.FC<IInput> = ({label, ...props}) => {
   console.log(props)
    return typeof label === "string" ? (
        <div>
            <Label> {label}
                <InputField {...props} />
            </Label>
        </div>
   ) : (
       <div>
       <Label>
           <span>{label[0]}</span>
           <span style={{color: theme.colors.cellKey}}>{label[1]}</span>
       </Label>
           <InputField {...props} />
       </div>
   )
}