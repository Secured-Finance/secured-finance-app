import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'

interface IButtonProps extends React.ButtonHTMLAttributes<'button'> {
    size?: 'xs' | 'sm' | 'md' | 'lg',
    accent?: 'default' | 'prominent' | 'success',
    outline?: boolean
}

const buttonColors = {
    default: theme.colors.primaryBlue,
    prominent: theme.colors.ratesRed,
    success: theme.colors.darkGreen
}

export const Button = styled.button<IButtonProps>`
  height: ${({size}) => theme.buttonSizes[size] };
  padding: ${`0 ${theme.sizes.base}px 0 ${theme.sizes.base}px`};
  font-weight: 500;
  font-family: Inter, Arial, sans-serif;
  font-size: ${theme.sizes.subhead}px;
  line-height: ${theme.sizes.subhead}px;
  color: ${({outline, accent}) => outline ? buttonColors[accent] : theme.colors.lightBackground};
  background-color: ${({accent, outline}) => outline? 'transparent' : buttonColors[accent]};
  border-radius: ${theme.sizes.radius}px;
  border: ${({accent}) => `1px solid ${buttonColors[accent]}` };
  cursor: pointer;
  
  :focus {
    outline: none;
  }
`

Button.defaultProps = {
    size: 'md',
    accent: 'default',
    outline: false
}