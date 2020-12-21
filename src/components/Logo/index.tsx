import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../../assets/img/logo.png'

const Logo: React.FC = () => {
  return (
    <StyledLogo to="/">
      <img src={logo} style={{ marginTop: -4, width: '190px' }} />
    </StyledLogo>
  )
}

const StyledLogo = styled(Link)`
	align-items: center;
	display: flex;
	justify-content: center;
	margin: 0;
	min-height: 44px;
	width: 190px;
	padding: 0;
	text-decoration: none;
	font-size: 14px;
	`

export default Logo
