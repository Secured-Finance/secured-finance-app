import React from 'react'
import styled from 'styled-components'
import theme from '../../theme'

interface IButtonProps extends React.ButtonHTMLAttributes<'button'> {
    size?: 'xs' | 'sm' | 'md' | 'lg',
    accent?: 'default' | 'prominent',
    outline?: boolean
}

const buttonColors = {
    default: theme.colors.primaryBlue,
    prominent: theme.colors.ratesRed,
}

export const Button = styled.button<IButtonProps>`
  height: 40px;
  font-weight: 500;
  font-family: Inter, Arial, sans-serif;
  font-size: ${theme.sizes.subhead}px;
  color: ${({accent}) => buttonColors[accent]};
  background-color: ${({accent, outline}) => outline? 'transparent' : buttonColors[accent]};
  border-radius: ${theme.sizes.radius}px;
  border: ${({accent}) => `1px solid ${buttonColors[accent]}` }
`
Button.defaultProps = {
    size: 'sm',
    accent: 'default',
    outline: false
}