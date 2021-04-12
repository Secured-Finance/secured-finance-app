import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        Lending
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/exchange">
        Terminal
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/history">
        History
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  // margin-left: auto;
`

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.cellKey};
  border-bottom: 2px solid transparent;
  font-weight: 600;
  margin: 0 16px;
  cursor: pointer;
  font-size: 14px;
  padding: ${({theme}) => `${theme.topBarPadding}px 8px ${theme.topBarPadding}px`};
  text-align: center;
  text-decoration: none;
  
  &:hover {
    color: ${(props) => props.theme.colors.grey};
  }
  &.active {
    color: ${(props) => props.theme.colors.lightBackground};
    border-bottom-color: ${(props) => props.theme.colors.sfBlue900};
    cursor: default;
  }
  @media (max-width: 400px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`

export default Nav
